import {Component, OnInit,Output, EventEmitter, ViewChild} from "@angular/core"
import { Router } from "@angular/router";

@Component({
    templateUrl: "./label.component.html",
    styleUrls: ["./label.component.css"]
})

export class LbaleComponent implements OnInit {
    options = {
        width: 600,
        src: 'assets/1.jpg',
        color: "red",
        activeColor:"green",
        disabled: false
    }
    loaddata=false
    currentGeometry=null;
    geometryDatas = [
        {
            geometry: {
                height: 57,
                width: 44,
                x: 119,
                y: 75
            },
            id: 1,
            active:false
        },
        {
            geometry: {
                height: 20,
                width: 20,
                x: 30,
                y: 30
            },
            id:2,
            active:true
        }
    ]
    @ViewChild("canvas") canvas
    constructor(private Router:Router) { }
    ngOnInit() {
        this.currentGeometry = this.geometryDatas[0]
    }
    rollBackFun(e){
        console.log(e)
    }
    go(){
        this.Router.navigate(['home'])
    }
    canvasClick(e){
        console.log(e)
        this.currentGeometry = e
    }
    deleteFun(e){
        console.log(e)
    }
    delete(){
        let index = this.geometryDatas.findIndex((value) => {
            return (value.geometry.x == this.currentGeometry.geometry.x) && (value.geometry.y == this.currentGeometry.geometry.y)
           })
        this.geometryDatas.splice(index,1)
        this.currentGeometry = null;
        this.canvas.updateData(this.geometryDatas)
    }
}