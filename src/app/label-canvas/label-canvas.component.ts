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

@Component({
    selector: 'Label-canvas',
    templateUrl: './label-canvas.component.html',
    styleUrls: ['./label-canvas.component.css']
})
export class LableCanvasComponent implements OnInit, AfterViewInit {
    @Input() options: any;
    @Input() id: any;
    @Output('canvasClick') canvasClick: EventEmitter<any> = new EventEmitter;
    @Output('rollBackFun') rollBackFun: EventEmitter<any> = new EventEmitter;
    @Output('deleteFun') deleteFun: EventEmitter<any> = new EventEmitter;
    canvas = null;
    ctx: any;
    cvs: any
    cvsH= 100
    cvsW: any
    imgH: any
    imgW: any
    imgLoaded = false
    flag = false;
    url: any
    inited=false;
    x = 0//鼠标开始移动的位置X
    y = 0//鼠标开始移动的位置Y
    geometryData: any
    @Input() geometryDatas = []
    cancelDraw = false
    lastUrl: any
    lastRect = null;//最后一次绘画的矩形
    imgsObj = [];//存储每次画布的对象
    currentGeometry =null;
    constructor() { }
    ngOnInit() { }
    ngAfterViewInit() {
        this.initImg()
    }
    // ngOnChanges(){
    //     console.log(1)
    //     if (this.inited) {
    //         console.log(this.geometryDatas)
    //         this.initImg()
    //     }
    // }
    initImg() {
        this.inited = true;
        let img = document.getElementById(this.id+'img');
        this.url = this.options.src
        // let mask = document.getElementById('common-canvas-mask');
        // mask.style.width=this.options.width+'px'
        let that =this
        let cvs=document.getElementById(this.id+'cvs') as HTMLCanvasElement;
        let cvsBox = document.getElementById('common-canvas')
        cvs.style.zIndex = '5';
        cvs.style.position = 'absolute';
        cvs.style.left='0';
        cvs.style.top='0';
        let ctx= cvs.getContext('2d')
        this.ctx = ctx;
        this.cvs = cvs;
        img.onload=function(){
            img.style.width=that.options.width+'px'
            that.cvsH= img.offsetHeight
            that.cvsW= img.offsetWidth
            cvsBox.style.width= that.cvsW+'px';
            cvsBox.style.height = that.cvsH+'px';
            that.initDrawRect(that.geometryDatas)
        }
    }
    initDrawRect(d){
        for (let i of d) {
            this.drawRects(i)
        }
    }
    mousedown(e){
        this.flag = true;
        this.x=e.offsetX
        this.y = e.offsetY
        // console.log(this.x,this.y)
        // let cvs = document.getElementById(this.id+'cvs') as HTMLCanvasElement;
        // this.url = cvs.toDataURL()
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
        console.log(1)
        for(let i of this.geometryDatas) {
            i.active = false;
            // this.ctx.strokeStyle= 'transparent'
            // this.initDrawRect(this.geometryDatas)
            if(x>i.geometry.x&&x<i.geometry.x+i.geometry.width&& y>i.geometry.y&&y<i.geometry.y+i.geometry.height){
                
                i.active = true
                // if (i.active) {
                //     this.ctx.strokeStyle= this.options.activeColor
                // } else {
                //     this.ctx.strokeStyle= this.options.color
                // }
                //this.initDrawRect(this.geometryDatas)
                this.currentGeometry = i
                this.initActiveDom(i)
                this.canvasClick.emit(i)
            }
        }
    }
    rollBack(){
        console.log(this.geometryDatas)
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
        let activeDom = document.getElementById('rect-active');
            activeDom.style.width = d.geometry.width +'px';
            activeDom.style.height = d.geometry.height +'px';
            activeDom.style.opacity = '0.1'
            activeDom.style.left = d.geometry.x +'px';
            activeDom.style.top = d.geometry.y +'px';
            activeDom.style.zIndex = '8';
    }
    resetActiveDom(){
        let activeDom = document.getElementById('rect-active');
            activeDom.style.width = 0 +'px';
            activeDom.style.height = 0 +'px';
            activeDom.style.opacity = '0.1'
            activeDom.style.left = 0 +'px';
            activeDom.style.top = 0 +'px';
            activeDom.style.zIndex = '0';
    }
    drawRects(d){
        // console.log(d.geometry)
        // console.log(d.id)
        if (d.active) {
            this.currentGeometry = d
            console.log(d)
            // this.ctx.strokeStyle= this.options.activeColor
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
        let img = new Image()
        img.setAttribute("crossOrigin",'anonymous')
        img.src = this.url;
        this.ctx.drawImage(img,0,0,this.cvsW,this.cvsH)
        img = null
    }
    cancelDrawRect(e){
        let lastGeometry = this.geometryDatas[this.geometryDatas.length -1]
        this.ctx.clearRect(lastGeometry.x,lastGeometry.y,lastGeometry.width,lastGeometry.height)
        // let img = new Image()
        // img.src=this.imgsObj[this.imgsObj.length]
        // img.setAttribute('crossOrigin','Anonymous')
        // this.ctx.drawImage(img,0,0,this.cvs.width,this.cvs.height)

    }
    errFunCallBack(type){
        //this.errFun.emit(type)
    }
    updateData(datas){
        this.geometryDatas = datas;
        this.currentGeometry = null;
        this.resetActiveDom()
        this.ctx.clearRect(0,0,this.cvsW,this.cvsH)
        this.url = this.cvs.toDataURL()
        this.initDrawRect(this.geometryDatas)
    }
    delete(){
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