import {
    Component, OnInit,
    Input, Output, EventEmitter,
    AfterViewInit,
    OnChanges
} from '@angular/core';
import {
    Router, ActivatedRoute,
    NavigationEnd
} from "@angular/router";
import { e } from '@angular/core/src/render3';

@Component({
    selector: 'Label-canvas',
    templateUrl: './label-canvas.component.html',
    styleUrls: ['./label-canvas.component.css']
})
export class LableCanvasComponent implements OnInit, AfterViewInit {
    /* 
    options = {
        width: 600,画布宽度
        src: 'assets/1.jpg', 图片地址
        color: "red",画笔颜色
        activeColor:"green",选中项背景色
        disabled: false是否禁用绘画
    }
    */
    @Input() options: any;
    @Input() id: any;//用于画布和图片的id
    @Input() geometryDatas = []//输入的矩形数据
    @Output('canvasClick') canvasClick: EventEmitter<any> = new EventEmitter;//抛出点击事件，抛出数据当前项
    @Output('rollBackFun') rollBackFun: EventEmitter<any> = new EventEmitter;//撤销，回退一步
    @Output('deleteFun') deleteFun: EventEmitter<any> = new EventEmitter;//删除事件，当前项
    ctx: any;//canvas画布2d对象
    cvs: any//canvas
    cvsH= 100//canvas高
    cvsW: any//canvas宽
    flag = false;//绘画使用开关，true开始绘画
    url: any//每次保存的base64图片信息
    x = 0//鼠标开始移动的位置X
    y = 0//鼠标开始移动的位置Y
    geometryData: any
    lastUrl: any
    lastRect = null;//最后一次绘画的矩形
    imgsObj = [];//存储每次画布的对象
    currentGeometry =null;//当前矩形坐标
    constructor() { }
    ngOnInit() { }
    ngAfterViewInit() {
        this.initImg()
    }
    initImg() {
        //初始化cnavas画布，初始化数据
        let img = document.getElementById(this.id+'img');
        this.url = this.options.src
        let that =this
        let cvsBox = document.getElementById('common-canvas')
        img.onload=function(){
            let cvs = document.createElement('canvas')
            let mask = document.getElementById('common-canvas-mask');
            cvs.id = that.id+'cvs';
            cvsBox.appendChild(cvs);
            img.style.width=that.options.width+'px'
            that.cvsH= img.offsetHeight
            that.cvsW= img.offsetWidth
            cvsBox.style.width= that.cvsW+'px';
            cvsBox.style.height = that.cvsH+'px';
            mask.style.width=that.cvsW+'px';
            mask.style.height=that.cvsH+'px';
            let HTMLCANVAS=(<HTMLCanvasElement>document.querySelector('#'+that.id+'cvs'));
            let HTMLELM = (<HTMLElement>document.querySelector('#'+that.id+'cvs'));
            HTMLCANVAS.width=img.offsetWidth;
            HTMLCANVAS.height=img.offsetHeight;
            HTMLELM.style.zIndex = '5';
            HTMLELM.style.position = 'absolute';
            HTMLELM.style.left='0';
            HTMLELM.style.top='0';
            let ctx= HTMLCANVAS.getContext('2d')
            that.ctx = ctx;
            that.cvs = HTMLCANVAS;
            HTMLCANVAS.addEventListener('mousedown',(e:Event)=>{
                that.mousedown(e)
            })
            HTMLCANVAS.addEventListener('mouseup',(e:Event)=>{
                that.mouseup(e)
            })
            HTMLCANVAS.addEventListener('mousemove',(e:Event)=>{
                that.mousemove(e)
            })
            that.initDrawRect(that.geometryDatas)
        }
    }
    initDrawRect(d){
        //初始化，绘画多个矩形
        for (let i of d) {
            this.drawRects(i)
        }
    }
    mousedown(e){
        this.flag = true;
        this.x=e.offsetX
        this.y = e.offsetY
    }
    mouseup(e){
        this.flag= false
        this.url = this.cvs.toDataURL()
        this.imgsObj.push(this.url)
        if (this.geometryData){
            this.geometryDatas.push(this.geometryData)
            this.lastRect=this.geometryData
            this.geometryData= null;

        }
        let x= e.offsetX
        let y = e.offsetY
        for(let i of this.geometryDatas) {
            i.active = false;
            if(x>i.geometry.x&&x<i.geometry.x+i.geometry.width&& y>i.geometry.y&&y<i.geometry.y+i.geometry.height){
                
                i.active = true
                this.currentGeometry = i
                this.initActiveDom(i)
                this.canvasClick.emit(i)
            }
        }
    }
    rollBack(){
        //撤销
        let lastGeometry = null;
        if (this.geometryDatas.length >0) {
            lastGeometry = this.geometryDatas[this.geometryDatas.length-1].geometry
        }
        this.rollBackFun.emit(lastGeometry)
        this.geometryDatas.pop();
        this.ctx.clearRect(0,0,this.cvsW,this.cvsH)
        this.url = this.cvs.toDataURL()
        this.initDrawRect(this.geometryDatas)
        this.resetActiveDom()
    }
    mousemove(e){
        if (!this.options.disabled) {
            this.drawRect(e)
        }
    }
    initActiveDom(d){
        //初始化当前项选中状态
        let activeDom = document.getElementById('rect-active');
            activeDom.style.width = d.geometry.width +'px';
            activeDom.style.height = d.geometry.height +'px';
            activeDom.style.opacity = '0.1'
            activeDom.style.left = d.geometry.x +'px';
            activeDom.style.top = d.geometry.y +'px';
            activeDom.style.zIndex = '8';
    }
    resetActiveDom(){
        //重置当前项选中状态
        let activeDom = document.getElementById('rect-active');
            activeDom.style.width = 0 +'px';
            activeDom.style.height = 0 +'px';
            activeDom.style.opacity = '0.1'
            activeDom.style.left = 0 +'px';
            activeDom.style.top = 0 +'px';
            activeDom.style.zIndex = '0';
    }
    drawRects(d){
        //画矩形
        if (d.active) {
            this.currentGeometry = d
            let activeDom = document.getElementById('rect-active');
            activeDom.style.width = d.geometry.width +'px';
            activeDom.style.height = d.geometry.height +'px';
            activeDom.style.opacity = '0.1'
            activeDom.style.left = d.geometry.x +'px';
            activeDom.style.top = d.geometry.y +'px';
            activeDom.style.zIndex = '8';

        }else {
            this.ctx.strokeStyle= this.options.color
        }
        this.ctx.strokeRect(d.geometry.x,d.geometry.y,d.geometry.width,d.geometry.height);
        this.url = this.cvs.toDataURL()
    }
    drawRect(e){
        if (this.flag) {
            if (e.offsetX-this.x > 0 && e.offsetY-this.y >10) {
                this.ctx.clearRect(0,0,this.cvsW,this.cvsH)
                this.loadImage()
                this.ctx.beginPath()
                this.ctx.strokeStyle= this.options.color
                // this.ctx.lineWidth =3
                this.ctx.strokeRect(this.x,this.y,e.offsetX-this.x,e.offsetY-this.y)
                this.geometryData = null;
                this.geometryData = {
                    geometry:{
                        x:this.x,
                        y:this.y,
                        width:e.offsetX-this.x,
                        height:e.offsetY-this.y
                    },
                    id:Math.random()
                }
            }
        }
    }
    loadImage(){
        //储存画布
        let img = new Image()
        img.setAttribute("crossOrigin",'anonymous')
        img.src = this.url;
        this.ctx.drawImage(img,0,0,this.cvsW,this.cvsH)
        img = null
    }
    updateData(datas){
        // 更新数据
        this.geometryDatas = datas;
        this.currentGeometry = null;
        this.resetActiveDom()
        this.ctx.clearRect(0,0,this.cvsW,this.cvsH)
        this.url = this.cvs.toDataURL()
        this.initDrawRect(this.geometryDatas)
    }
    delete(){
        //删除
        this.deleteFun.emit(this.currentGeometry)
        let index = this.geometryDatas.findIndex((value) => {
            return (value.geometry.x == this.currentGeometry.geometry.x) && (value.geometry.y == this.currentGeometry.geometry.y)
           })
        this.geometryDatas.splice(index,1)
        this.currentGeometry = null;
        this.resetActiveDom()
        this.ctx.clearRect(0,0,this.cvsW,this.cvsH)
        this.url = this.cvs.toDataURL()
        this.initDrawRect(this.geometryDatas)
    }
}