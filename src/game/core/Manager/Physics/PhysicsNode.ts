
module game {
	import Browser = Laya.Browser;
	import Sprite = Laya.Sprite;

	export interface PhysicsCollision {
		onCollisionStart(other: any);
		onCollisionEnd(other: any);
		// onCollisionActive(othera: PhysicsNode);
	}
	export interface GPoint {
		x: number,
		y: number
	}

	export class PhysicsNode extends Sprite implements PhysicsCollision {
		/**物理引擎*/
		private mMatter: any = Browser.window.Matter;
		/**物理引擎管理类*/
		private mPhysicMgr: PhysicsManager = null;
		/**刚体*/
		private mBody: any = null;
		private mAddedToPhysicsWorld: boolean = false;

		private mBodyPos: GPoint = { x: 0, y: 0 }; P
		private mBodyRotation: number = 0;

		// 绘制碰撞边缘
		private mWireframe: Laya.Sprite;
		m
		// 形状
		private mShape: PhysicsShape;
		// 形状数据
		private mShapeData: any[];

		// 碰撞group
		private mCollisionGroup: number = 0;
		// 碰撞category
		private mCollisionCategory: number = 0x0001;
		// 碰撞mask
		private mCollisionMask: number = 0xFFFFFFFF;

		// 用于调试的标签
		private mDebugTag: string = "";
		private mDebugLabel: Laya.Label = null;

		protected mUiRootSprite: Laya.Sprite;

		constructor(shape: PhysicsShape, shapeData: any[]) {
			super();

			this.initPhysicsComponent(shape, shapeData);

			this.initUISprite();

			this.once(Laya.Event.ADDED, this, this.onAdded);
		}

		protected onAdded() {
			if (!this.mAddedToPhysicsWorld) {
				this.mAddedToPhysicsWorld = true;

				this.mPhysicMgr.addBody(this.mBody);

				this.mBodyPos.x = this.posX;
				this.mBodyPos.y = this.posY;
				this.mMatter.Body.setPosition(this.mBody, this.mBodyPos);

				this['initialAngle'] = this.rotation;
			}
		}

		protected removeBody() {
			this.mPhysicMgr.remove(this.mBody);
		}

		public destroy() {
			this.mPhysicMgr.remove(this.mBody);
			super.destroy();
		}

		set collisionGroup(g: number) {
			this.mBody.collisionFilter.group = g;
			this.mCollisionGroup = g;
		}

		get collisionGroup() {
			return this.mCollisionGroup;
		}

		set collisionCategory(c: number) {
			this.mBody.collisionFilter.category = c;
			this.mCollisionCategory = c;
		}

		get collisionCategory() {
			return this.mCollisionCategory;
		}

		set collisionMask(m: number) {
			this.mBody.collisionFilter.mask = m;
			this.mCollisionMask = m;
		}

		get collisionMask() {
			return this.mCollisionMask;
		}

		set debugTag(v: string) {
			this.mDebugTag = v;
			this.updateDebugLabel();
		}

		// 显示碰撞边缘
		public showWireframe(show: boolean) {
			if (show) {
				this._drawWireframe();
				if (this.mDebugLabel) {
					this.mDebugLabel.visible = true;
				}
			} else {
				this.mWireframe.graphics.clear();
				if (this.mDebugLabel) {
					this.mDebugLabel.visible = false;
				}
			}
		}

		// 绘制碰撞边缘
		private _drawWireframe() {
			this.mWireframe.graphics.clear();

			switch (this.mShape) {
				case PhysicsShape.Circle: {
					let [x, y, radius] = this.mShapeData;
					if (this.mPhysicMgr.drawWireframes) {
						this.mWireframe.graphics.drawCircle(x, y, radius, null, "#ff0000", 2);
						this.mWireframe.graphics.drawLine(x, y, x, y - radius, "#ffff00", 2);
					}
					break;
				}
				case PhysicsShape.Rectangle: {
					let [x, y, width, height] = this.mShapeData;
					if (this.mPhysicMgr.drawWireframes) {
						this.mWireframe.graphics.drawRect(x, y, width, height, null, "#ff0000", 2);
						this.mWireframe.graphics.drawLine(x + width / 2, y + height / 2, x + width / 2, y, "#ffff00", 2);
					}
					break;
				}
				case PhysicsShape.RegularPolygon: {
					let [x, y, sides, radius] = this.mShapeData;
					if (this.mPhysicMgr.drawWireframes) {
						let drawPoints = [];
						for (let v in this.mBody.vertices) {
							let pos = this.mBody.vertices[v];
							drawPoints.push(pos.x, pos.y);
						}
						this.mWireframe.graphics.drawPoly(0, 0, drawPoints, null, "#ff0000", 2);
					}
					break;
				}
				case PhysicsShape.Polygon: {
					let points: GPoint[] = [];
					for (let i = 0; i < this.mShapeData.length; i += 2) {
						points.push({ x: this.mShapeData[i], y: this.mShapeData[i + 1] });
					}
					if (this.mPhysicMgr.drawWireframes) {
						let drawPoints = [];
						for (let v in this.mBody.vertices) {
							let pos = this.mBody.vertices[v];
							drawPoints.push(pos.x, pos.y);
						}
						this.mWireframe.graphics.drawPoly(0, 0, drawPoints, null, "#ff0000", 2);
					}
					break;
				}
			}

			this.updateDebugLabel();
		}

		private updateDebugLabel() {
			if (!this.mDebugLabel) {
				this.mDebugLabel = new Laya.Label();
				this.mDebugLabel.text = this.mDebugTag;
				this.mDebugLabel.align = "center";
				this.mDebugLabel.fontSize = 30;
				this.mDebugLabel.color = "#ffffff";
				this.mDebugLabel.stroke = 5;
				this.mDebugLabel.strokeColor = "#000000";
				this.mWireframe.addChild(this.mDebugLabel);
			}

			this.mDebugLabel.text = this.mDebugTag;

			this.mDebugLabel.visible = this.mPhysicMgr.drawWireframes;
		}

		private initPhysicsComponent(shape: PhysicsShape, shapeData: any[]) {
			this.mPhysicMgr = PhysicsManager.getInstance();

			// 保存形状及数据
			this.mShape = shape;
			this.mShapeData = shapeData;

			// 创建body
			let bodyOptions = {
				friction: 0,
				isSensor: true,		// 强制设为传感器（忽略重力、摩擦力等，仅利用物理引擎的碰撞检测）
			};
			switch (shape) {
				case PhysicsShape.Circle: {
					if (shapeData.length != 3) {
						throw Error("圆形数据异常");
					}
					let [x, y, radius] = shapeData;
					this.mBody = this.mPhysicMgr.createBodyCircle(x, y, radius, bodyOptions);
					break;
				}
				case PhysicsShape.Rectangle: {
					if (shapeData.length != 4) {
						throw Error("矩形数据异常");
					}
					let [x, y, width, height] = shapeData;
					this.mBody = this.mPhysicMgr.createBodyRectangle(x, y, width, height, bodyOptions);
					break;
				}
				case PhysicsShape.RegularPolygon: {
					if (shapeData.length != 4) {
						throw Error("正多边形数据异常");
					}
					let [x, y, sides, radius] = shapeData;
					this.mBody = this.mPhysicMgr.createBodyRegularPolygon(x, y, sides, radius, bodyOptions);
					break;
				}
				case PhysicsShape.Polygon: {
					if (shapeData.length % 2 != 0) {
						throw Error("多边形顶点数据异常");
					}

					let points: GPoint[] = [];
					for (let i = 0; i < shapeData.length; i += 2) {
						points.push({ x: shapeData[i], y: shapeData[i + 1] });
					}
					this.mBody = this.mPhysicMgr.createBodyFromVertices(points, bodyOptions);
					break;
				}
			}

			// 绘制碰撞边缘
			this.mWireframe = new Sprite();
			this.mWireframe.zOrder = 10000;
			this.addChild(this.mWireframe);
			this._drawWireframe();

			// 绑定LayaSprite到matter的body
			this.mBody.layaSprite = this;
		}

		private initUISprite() {
			this.mUiRootSprite = new Laya.Sprite();
			this.mUiRootSprite.zOrder = 10001;
			this.addChild(this.mUiRootSprite);
		}

		onCollisionStart(other: any) {
			// console.log(`onCollisionStart - ${other}`);
		}

		onCollisionEnd(other: any) {
			// console.log(`onCollisionEnd - ${other}`);
		}

		public pos(x: number, y: number, speedMode?: boolean): Sprite {
			this.posX = x;
			this.posY = y;
			return this;
		}

		set posX(x: number) {
			this.mBodyPos.x = x;
			this.mMatter.Body.setPosition(this.mBody, this.mBodyPos);
		}

		set posY(y: number) {
			this.mBodyPos.y = y;
			this.mMatter.Body.setPosition(this.mBody, this.mBodyPos);
		}

		get posX(): number {
			return this.mBodyPos.x;
		}

		get posY(): number {
			return this.mBodyPos.y;
		}

		public setAngle(ang: number) {
			this.mBodyRotation = ang;
			// this.mMatter.Body.setAngle(this._body, Angle2Radian(ang));

			this.mUiRootSprite.rotation = -ang;
			if (this.mDebugLabel) {
				this.mDebugLabel.rotation = -ang;
			}
		}

		public getAngle(): number {
			return this.mBodyRotation;
		}
	}
}

