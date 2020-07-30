		// 获取画板
		var canvas = document.getElementById("drawing-board");
		var ctx = canvas.getContext("2d");
		// ****希望最终把画板的大小做成可供用户调节的
		
		//将画板的大小铺满除菜单栏之外的区域，
		function canvasSetSize() {
		    var pageWidth = window.innerWidth;
		    var pageHeight = window.innerHeight;
		    canvas.width = pageWidth;
		    canvas.height = pageHeight * 0.85;
		}
		//当浏览器宽高发生变化时，盒子大小与浏览器页面宽高保持一致
		function autoSetSize() {
			canvasSetSize();
		    window.onresize = function () {
		        canvasSetSize();
		    }
		}
		autoSetSize();
		
		//colors块的颜色设置数量多且功能设置较为单一，所以在js中使用数组循环的方法进行背景颜色赋值
		var arrColors = ['#000000','#7F7F7F','#860015','#EC1C24','#FF7F27','#FFF200','#22B14C','#00A2E8','#3F48CC','#A349A4','#FFFFFF','#C3C3C3','#B97A57','#FFAEC9','#FFC90E','#EFE4B0','#B5E61D','#99D9EA','#7092BE','#C8BFE7'];
		var colorsDiv = document.querySelectorAll("#colors div");
		for(let i = 0;i<20;i++){
			colorsDiv[i].style.backgroundColor = arrColors[i];
		}
		
		//画笔颜色设置 开始
		var colorSave = 1;
		var penColor = "#000000";//默认为黑色
		for (let i = 0;i<20;i++){
			colorsDiv[i].onclick = function (){
				penColor = arrColors[i];
				if(colorSave == 1){
					document.querySelector(".color1").style.backgroundColor = penColor;
				}else{
					document.querySelector(".color2").style.backgroundColor = penColor;
				}
			}
		}
		
		var color1 = document.querySelector(".color1");
		var color2 = document.querySelector(".color2");
		var boxColor1 = document.getElementById("color1");
		var boxColor2 = document.getElementById("color2");
		
		boxColor1.classList.add("box-onclick");
		
		boxColor1.onclick = function(){
			penColor = color1.style.backgroundColor;
			boxColor1.classList.add("box-onclick");
			boxColor2.classList.remove("box-onclick");
			colorSave = 1;
		}
		boxColor2.onclick = function(){
			penColor = color2.style.backgroundColor;
			boxColor2.classList.add("box-onclick");
			boxColor1.classList.remove("box-onclick");
			colorSave = 2;
		}
		//画笔颜色设置 结束
		
		//画笔线宽设置 开始
		penLineWidth = 1;
		//设置隐藏的线宽设置元素在点击时显示，离开时继续隐藏
		var shapeLineWidth = document.getElementById("shape-lineWidth");
		var lineWidthHidden = document.getElementById("lineWidth-hidden");
		shapeLineWidth.onclick = function(){
			if(lineWidthHidden.style.display == "none"){//在这里遇到了加载页面后第一次点击无法显示隐藏元素的问题，后经查询明白在css中设置的样式使用style是无法读取到的，style只能读取行内元素设置的属性，所以把初始的"display:none"设置到html文件中的对应元素标签内才行。
				lineWidthHidden.style.display = "block";
			}else{
				lineWidthHidden.style.display = "none";//这个是为了在点击线宽后使隐藏元素消失
			}
		}
		shapeLineWidth.onmouseleave = function(){
			lineWidthHidden.style.display = "none";
		}
		var lineWidthOne = document.querySelector("#lineWidth-hidden>div:first-child");
		document.querySelector("#lineWidth-hidden>div:first-child").onclick = function(){
			penLineWidth = 1;
		}
		document.querySelector("#lineWidth-hidden>div:nth-child(2)").onclick = function(){
			penLineWidth = 2;
		}
		document.querySelector("#lineWidth-hidden>div:nth-child(3)").onclick = function(){
			penLineWidth = 4;
		}
		document.querySelector("#lineWidth-hidden>div:nth-child(4)").onclick = function(){
			penLineWidth = 8;
		}
		document.querySelector("#lineWidth-hidden>div:nth-child(5)").onclick = function(){
			penLineWidth = document.querySelector("#lineWidth-hidden>div:nth-child(5)>input").value;
		}
		//画笔线宽设置结束
		
		//画板功能实现 开始
		var flag=false;
		var penColorTempor;
		function drawLine(){
			//鼠标按下
			canvas.onmousedown = function (e) {
				if (eraserState){
					penColor = "white"
				}else{
					if(colorSave == 1){
						penColor = document.querySelector(".color1").style.backgroundColor;
					}else{
						penColor = document.querySelector(".color2").style.backgroundColor;
					}
				};
				if(historyData.length == 20){
					historyData.shift();
				}
				historyData.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
			    var mouseX= e.pageX-this.offsetLeft;//this指画板canvas
			    var mouseY= e.pageY-this.offsetTop;
			    flag=true;
			    ctx.beginPath();
			    ctx.lineWidth=penLineWidth;
				ctx.strokeStyle = penColor;
			    ctx.moveTo((mouseX),(mouseY));
			};
			//鼠标移动
			canvas.onmousemove = function (e) {
			    var mouseX= e.pageX-this.offsetLeft;
			    var mouseY= e.pageY-this.offsetTop;
			    if(flag){
			        ctx.lineTo((mouseX),(mouseY));
			        ctx.stroke();
			    }
			}
			//鼠标松开
			canvas.onmouseup = function (e) {
			    flag=false;
			}
			// 鼠标离开画板的范围
			canvas.onmouseleave = function(e){
				flag = false;
			}
		}
		drawLine();
		
		// 橡皮擦功能(需要结合drawLine划线来实现)
		var eraserState = false;
		document.querySelector("#tool-bottom>img:first-child").onclick = function(){
			eraserState = true;
		}
		document.querySelector("#tool-pen").onclick = function(){
			eraserState = false;
			penColor = penColorTempor;
		};
		// var eraser = document.querySelector("#tool-bottom>img:first-child");
		// eraser.onclick = function(){
		// 	eraserState = true;
		// }
		// if(eraserState) {
		// 	ctx.save();
		// 	ctx.globalCompositeOperation = "destination-out";
		// 	ctx.stroke();
		// 	ctx.closePath();
		// 	ctx.clip();
		// 	ctx.clearRect(0,0,canvas.width,canvas.height);
		// 	ctx.restore();
		// }
		
		//清除画布功能 开始  (要想把清空功能也做成可返回的，也要加入对historyData[]数组的一系列操作，而且要放在清空画布前)
		var toolClear = document.getElementById('tool-clear');
		toolClear.onclick = function(){
			if(historyData.length == 20){
				historyData.shift();
			}
			historyData.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
			ctx.clearRect(0,0,canvas.width,canvas.height);
		}
		
		//撤销，返回上一步功能 开始
		var historyData = [];
		var toolReturn = document.getElementById("tool-return");
		toolReturn.onclick = function(){
			if(historyData.length){
				ctx.clearRect(0,0,canvas.width,canvas.height);
				ctx.putImageData(historyData[historyData.length-1],0,0);
				historyData.pop();
			}
		}
	//绘制shape-box中的图形
		//定义公用函数样式
		
		//绘制椭圆
		// document.querySelector("").onclick = function(e){
			
		// };