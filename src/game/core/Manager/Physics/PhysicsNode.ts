
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
		private _body: any = null;
		private _addedToPhysicsWorld: boolean = false;

		private _bodyPos: GPoint = { x: 0, y: 0 }; P
		private _bodyRotation: number = 0;

		// 绘制碰撞边缘
		private _wireframe: Laya.Sprite;
		m
		// 形状
		private _shape: PhysicsShape;
		// 形状数据
		private _shapeData: any[];

		// 碰撞group
		private _collisionGroup: number = 0;
		// 碰撞category
		private _collisionCategory: number = 0x0001;
		// 碰撞mask
		private _collisionMask: number = 0xFFFFFFFF;

		// 用于调试的标签
		private _debugTag: string = "";
		private _debugLabel: Laya.Label = null;

		protected _uiRootSprite: Laya.Sprite;

		constructor(shape: PhysicsShape, shapeData: any[]) {
			super();

			this.initPhysicsComponent(shape, shapeData);

			this.initUISprite();

			this.once(Laya.Event.ADDED, this, this.onAdded);
		}

		protected onAdded() {
			if (!this._addedToPhysicsWorld) {
				this._addedToPhysicsWorld = true;

				this.mPhysicMgr.addBody(this._body);

				this._bodyPos.x = this.posX;
				this._bodyPos.y = this.posY;
				this.mMatter.Body.setPosition(this._body, this._bodyPos);

				this['initialAngle'] = this.rotation;
			}
		}

		protected removeBody() {
			this.mPhysicMgr.remove(this._body);
		}

		public destroy() {
			this.mPhysicMgr.remove(this._body);
			super.destroy();
		}

		set collisionGroup(g: number) {
			this._body.collisionFilter.group = g;
			this._collisionGroup = g;
		}

		get collisionGroup() {
			return this._collisionGroup;
		}

		set collisionCategory(c: number) {
			this._body.collisionFilter.category = c;
			this._collisionCategory = c;
		}

		get collisionCategory() {
			return this._collisionCategory;
		}

		set collisionMask(m: number) {
			this._body.collisionFilter.mask = m;
			this._collisionMask = m;
		}

		get collisionMask() {
			return this._collisionMask;
		}

		set debugTag(v: string) {
			this._debugTag = v;
			this.updateDebugLabel();
		}

		// 显示碰撞边缘
		public showWireframe(show: boolean) {
			if (show) {
				this._drawWireframe();
				if (this._debugLabel) {
					this._debugLabel.visible = true;
				}
			} else {
				this._wireframe.graphics.clear();
				if (this._debugLabel) {
					this._debugLabel.visible = false;
				}
			}
		}

		// 绘制碰撞边缘
		private _drawWireframe() {
			this._wireframe.graphics.clear();

			switch (this._shape) {
				case PhysicsShape.Circle: {
					let [x, y, radius] = this._shapeData;
					if (this.mPhysicMgr.drawWireframes) {
						this._wireframe.graphics.drawCircle(x, y, radius, null, "#ff0000", 2);
						this._wireframe.graphics.drawLine(x, y, x, y - radius, "#ffff00", 2);
					}
					break;
				}
				case PhysicsShape.Rectangle: {
					let [x, y, width, height] = this._shapeData;
					if (this.mPhysicMgr.drawWireframes) {
						this._wireframe.graphics.drawRect(x, y, width, height, null, "#ff0000", 2);
						this._wireframe.graphics.drawLine(x + width / 2, y + height / 2, x + width / 2, y, "#ffff00", 2);
					}
					break;
				}
				case PhysicsShape.RegularPolygon: {
					let [x, y, sides, radius] = this._shapeData;
					if (this.mPhysicMgr.drawWireframes) {
						let drawPoints = [];
						for (let v in this._body.vertices) {
							let pos = this._body.vertices[v];
							drawPoints.push(pos.x, pos.y);
						}
						this._wireframe.graphics.drawPoly(0, 0, drawPoints, null, "#ff0000", 2);
					}
					break;
				}
				case PhysicsShape.Polygon: {
					let points: GPoint[] = [];
					for (let i = 0; i < this._shapeData.length; i += 2) {
						points.push({ x: this._shapeData[i], y: this._shapeData[i + 1] });
					}
					if (this.mPhysicMgr.drawWireframes) {
						let drawPoints = [];
						for (let v in this._body.vertices) {
							let pos = this._body.vertices[v];
							drawPoints.push(pos.x, pos.y);
						}
						this._wireframe.graphics.drawPoly(0, 0, drawPoints, null, "#ff0000", 2);
					}
					break;
				}
			}

			this.updateDebugLabel();
		}

		private updateDebugLabel() {
			if (!this._debugLabel) {
				this._debugLabel = new Laya.Label();
				this._debugLabel.text = this._debugTag;
				this._debugLabel.align = "center";
				this._debugLabel.fontSize = 30;
				this._debugLabel.color = "#ffffff";
				this._debugLabel.stroke = 5;
				this._debugLabel.strokeColor = "#000000";
				this._wireframe.addChild(this._debugLabel);
			}

			this._debugLabel.text = this._debugTag;

			this._debugLabel.visible = this.mPhysicMgr.drawWireframes;
		}

		private initPhysicsComponent(shape: PhysicsShape, shapeData: any[]) {
			this.mPhysicMgr = PhysicsManager.getInstance();

			// 保存形状及数据
			this._shape = shape;
			this._shapeData = shapeData;

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
					this._body = this.mPhysicMgr.createBodyCircle(x, y, radius, bodyOptions);
					break;
				}
				case PhysicsShape.Rectangle: {
					if (shapeData.length != 4) {
						throw Error("矩形数据异常");
					}
					let [x, y, width, height] = shapeData;
					this._body = this.mPhysicMgr.createBodyRectangle(x, y, width, height, bodyOptions);
					break;
				}
				case PhysicsShape.RegularPolygon: {
					if (shapeData.length != 4) {
						throw Error("正多边形数据异常");
					}
					let [x, y, sides, radius] = shapeData;
					this._body = this.mPhysicMgr.createBodyRegularPolygon(x, y, sides, radius, bodyOptions);
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
					this._body = this.mPhysicMgr.createBodyFromVertices(points, bodyOptions);
					break;
				}
			}

			// 绘制碰撞边缘
			this._wireframe = new Sprite();
			this._wireframe.zOrder = 10000;
			this.addChild(this._wireframe);
			this._drawWireframe();

			// 绑定LayaSprite到matter的body
			this._body.layaSprite = this;
		}

		private initUISprite() {
			this._uiRootSprite = new Laya.Sprite();
			this._uiRootSprite.zOrder = 10001;
			this.addChild(this._uiRootSprite);
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
			this._bodyPos.x = x;
			this.mMatter.Body.setPosition(this._body, this._bodyPos);
		}

		set posY(y: number) {
			this._bodyPos.y = y;
			this.mMatter.Body.setPosition(this._body, this._bodyPos);
		}

		get posX(): number {
			return this._bodyPos.x;
		}

		get posY(): number {
			return this._bodyPos.y;
		}

		public setAngle(ang: number) {
			this._bodyRotation = ang;
			// this.mMatter.Body.setAngle(this._body, Angle2Radian(ang));

			this._uiRootSprite.rotation = -ang;
			if (this._debugLabel) {
				this._debugLabel.rotation = -ang;
			}
		}

		public getAngle(): number {
			return this._bodyRotation;
		}
	}
}

