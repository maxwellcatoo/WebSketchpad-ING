//获取画板元素
			let canvas = document.getElementById("drawing-board");
			let ctx = canvas.getContext("2d");
			let penColor = 'black';
			let penColor2 = penColor;
			let penWidth = 2;
			let shapeLineWidth = document.getElementById("shape-lineWidth");
			let lineWidthHidden = document.getElementById("lineWidth-hidden");
			let flag=false;
			let penColorTempor;
			let eraserState = false;
			let eraser = document.getElementById("eraser")
			let pen = document.getElementById("pen")
			let toolClear = document.getElementById('clear');
			let historyData = [];
			let toolReturn = document.getElementById("return");
			let lineWidthOne = document.querySelector("#lineWidth-hidden>div:first-child");
			let pencolor = document.querySelector('.penColor')
			let penColorHidden = document.getElementById('penColor-hidden')
			let timer = null
			let save = document.getElementById('save')
			
			pen.classList.add('active');
//将画板的大小铺满整个屏幕
			function canvasSetSize() {
			    let pageWidth = window.innerWidth;
			    let pageHeight = window.innerHeight;
			    canvas.width = pageWidth;
			    canvas.height = pageHeight;
			};
			
//当浏览器宽高发生变化时，盒子大小与浏览器页面宽高保持一致
			function autoSetSize() {
				canvasSetSize();
			    window.onresize = function () {
			        canvasSetSize();
			    }
			};
			autoSetSize();
//画笔颜色设置
			pencolor.onclick = function(){
				//点击颜色选取时，隐藏线宽选取界面
				if(lineWidthHidden.style.display == "block"){
					lineWidthHidden.style.display = "none";
				}
				if(penColorHidden.style.display == "none"){
					penColorHidden.style.display = "flex";
				}else{
					penColorHidden.style.display = "none";//这个是为了在点击线宽后使隐藏元素消失
				}
			}
			penColorHidden.onmouseleave = function(){
				//对鼠标离开该页面后页面立即消失增加100ms延迟，因为鼠标在斜移向隐藏页面顶部或底部时会短时间离开页面，不加延迟会导致页面关闭
					clearTimeout(timer)
					timer = setTimeout(() => {
						penColorHidden.onmouseleave = function() {
							penColorHidden.style.display = "none";
						}
					},1000)
			}
			document.querySelector('.penColorItem:first-child').onclick = function() {
				penColor = 'black'
				penColor2 = penColor
			}
			document.querySelector('.penColorItem:nth-child(2)').onclick = function() {
				penColor = 'red'
				penColor2 = penColor
			}
			document.querySelector('.penColorItem:nth-child(3)').onclick = function() {
				penColor = 'blue'
				penColor2 = penColor
			}
			document.querySelector('.penColorItem:nth-child(4)').onclick = function() {
				penColor = 'orange'
				penColor2 = penColor
			}
			document.querySelector('.penColorItem:nth-child(5)').onclick = function() {
				penColor = 'green'
				penColor2 = penColor
			}
			document.querySelector('.penColorItem:nth-child(6)').onclick = function() {
				penColor = 'gray'
				penColor2 = penColor
			}
			
//画笔线宽设置
			penLineWidth = penWidth;
			//设置隐藏的线宽设置元素在点击时显示，离开时继续隐藏
			shapeLineWidth.onclick = function(){
				//点击时，若color隐藏的颜色选取框状态为显现，则将其隐藏
				if(penColorHidden.style.display == "flex"){
					penColorHidden.style.display = "none";
				}
				
				if(lineWidthHidden.style.display == "none"){//在这里遇到了加载页面后第一次点击无法显示隐藏元素的问题，后经查询明白在css中设置的样式使用style是无法读取到的，style只能读取行内元素设置的属性，所以把初始的"display:none"设置到html文件中的对应元素标签内才行。
					lineWidthHidden.style.display = "block";
				}else{
					lineWidthHidden.style.display = "none";//这个是为了在点击线宽后使隐藏元素消失
				}
			}
			lineWidthHidden.onmouseleave = function(){
				clearTimeout(timer)
				timer =  setTimeout(() => {
					lineWidthHidden.onmouseleave = function() {
						lineWidthHidden.style.display = "none";
					}
				},1000)
			}
			document.querySelector("#lineWidth-hidden>div:first-child").onclick = function(){
				penLineWidth = 1;
				penWidth = penLineWidth;//这里多写一个是为了防止在橡皮在激活状态时，用户调整线宽，之后点击画笔，画笔线宽未能更新至调整的线宽的bug
			}
			document.querySelector("#lineWidth-hidden>div:nth-child(2)").onclick = function(){
				penLineWidth = 2;
				penWidth = penLineWidth;
			}
			document.querySelector("#lineWidth-hidden>div:nth-child(3)").onclick = function(){
				penLineWidth = 4;
				penWidth = penLineWidth;
			}
			document.querySelector("#lineWidth-hidden>div:nth-child(4)").onclick = function(){
				penLineWidth = 8;
				penWidth = penLineWidth;
			}
			document.querySelector("#lineWidth-hidden>div:nth-child(5)").onclick = function(){
				penLineWidth = document.querySelector("#lineWidth-hidden>div:nth-child(5)>input").value;
				penWidth = penLineWidth;
			}
			
//画板功能实现
			function pcDrawLine(){
	//鼠标按下
				canvas.onmousedown = function (e) {
					//鼠标按下时，显示出的线宽和颜色选取再次隐藏
					if(penColorHidden.style.display == "flex"){
						penColorHidden.style.display = "none";
					}
					if(lineWidthHidden.style.display == "block"){
						lineWidthHidden.style.display = "none";
					}
					if (eraserState){
						penColor = "white"
						penLineWidth = 31
					}
					if(historyData.length == 20){
						historyData.shift();
					};
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
				    let mouseX= e.pageX-this.offsetLeft;
				    let mouseY= e.pageY-this.offsetTop;
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
			};
			function phoneDrawLine() {
	//触摸按下
				canvas.ontouchstart = function (e) {
					if(penColorHidden.style.display == "flex"){
						penColorHidden.style.display = "none";
					}
					if(lineWidthHidden.style.display == "block"){
						lineWidthHidden.style.display = "none";
					}
					if (eraserState){
						penColor = "white"
						penLineWidth = 31
					}
					if(historyData.length == 20){
						historyData.shift();
					};
					historyData.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
					// saveData(this.firstDot);
					flag = true;
					let x = e.touches[0].clientX;
					let y = e.touches[0].clientY;
					ctx.beginPath();
					ctx.lineWidth=penLineWidth;
					ctx.strokeStyle = penColor;
					ctx.moveTo(x,y);
					// ctx.save();
				};
	//触摸移动
				canvas.ontouchmove = function (e) {
				    if (flag) {
				        let x = e.touches[0].clientX;
				        let y = e.touches[0].clientY;
								if(flag) {
									ctx.lineTo(x,y);
									ctx.stroke();
								}
				    }
				};
							
				canvas.ontouchend = function () {
				    painting = false;
				}
			}
			
			
			if (document.body.ontouchstart !== undefined) {
					phoneDrawLine()    
			}else{
					pcDrawLine()
			}
			
// 橡皮擦功能(需要结合drawLine划线来实现)
			eraser.onclick = function(){
				//按下其他键时，显示出的线宽和颜色选取再次隐藏
				if(penColorHidden.style.display == "flex"){
					penColorHidden.style.display = "none";
				}
				if(lineWidthHidden.style.display == "block"){
					lineWidthHidden.style.display = "none";
				}
				eraserState = true;
				eraser.classList.add('active');
				pen.classList.remove('active');
				penLineWidth = 31
				penColor = 'white'
			};
			pen.onclick = function(){
				//按下其他键时，显示出的线宽和颜色选取再次隐藏
				if(penColorHidden.style.display === "flex"){
					penColorHidden.style.display = "none";
				}
				if(lineWidthHidden.style.display === "block"){
					lineWidthHidden.style.display = "none";
				}
				eraserState = false;
				pen.classList.add('active');
				eraser.classList.remove('active');
				penLineWidth = penWidth
				penColor = penColor2
			};
			
//清除画布功能(要想把清空功能也做成可返回的，也要加入对historyData[]数组的一系列操作，而且要放在清空画布前)
			toolClear.onclick = function(){
				//按下其他键时，显示出的线宽和颜色选取再次隐藏
				if(penColorHidden.style.display == "flex"){
					penColorHidden.style.display = "none";
				}
				if(lineWidthHidden.style.display === "block"){
					lineWidthHidden.style.display = "none";
				}
				if(historyData.length == 20){
					historyData.shift();
				}
				historyData.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
				ctx.clearRect(0,0,canvas.width,canvas.height);
			}
			
//撤销，返回上一步功能 开始
			toolReturn.onclick = function(){
				//按下其他键时，显示出的线宽和颜色选取再次隐藏
				if(penColorHidden.style.display == "flex"){
					penColorHidden.style.display = "none";
				}
				if(lineWidthHidden.style.display == "block"){
					lineWidthHidden.style.display = "none";
				}
				if(historyData.length){
					ctx.clearRect(0,0,canvas.width,canvas.height);
					ctx.putImageData(historyData[historyData.length-1],0,0);
					historyData.pop();
				}
			}
//保存功能开始			
			save.onclick = function () {
				//按下其他键时，显示出的线宽和颜色选取再次隐藏
				if(penColorHidden.style.display == "flex"){
					penColorHidden.style.display = "none";
				}
				if(lineWidthHidden.style.display == "block"){
					lineWidthHidden.style.display = "none";
				}
			    let imgUrl = canvas.toDataURL("image/png");
			    let saveA = document.createElement("a");
			    document.body.appendChild(saveA);
			    saveA.href = imgUrl;
			    saveA.download = "zspic" + (new Date).getTime();
			    saveA.target = "_blank";
			    saveA.click();
			};