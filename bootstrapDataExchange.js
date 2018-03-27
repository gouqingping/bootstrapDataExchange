/*
	name: 'BootstrapDataExchange',
	version: '1.0.0',
	time: "2018-03-17 16:23:00",
	author: "PatGp"
 */

;(function(b, k) {
	"function" === typeof define && define.amd ? define("BootstrapDataExchange", ["jquery"], function(q) {
		return k(q, b)
	}) : "object" === typeof exports && "undefined" !== typeof module ? module.exports = k(require("jquery"), global || b) : b.tree = k(b.jQuery, b)
}(this, function($) {
    'use strict';
    class BootstrapDataExchange {
        constructor(config,model) {
    		// type page or dialog
            let defaults = {
                debug: false,
    			type: "page",
    			url:"bootstrapDataExchange.json",
    			title:"数据交换展示",
    			style:"Bootstrap4",
    			height:"200px",
    			select:"select", // 选中的ID
    			wait:"wait", 	// 待选的ID
    			allselcet:true, 	// 待选的ID
    			language:{
    				info:{
    					labTEXT:["选中", "备选"],
    					otnTEXT:['排序','选择'],
    					all:"全选",
    					dispel:"全消",
    					selcet:{
    						not:"请选择一项",
    						iselect:"必选项不能移动",
    					}
    				},
    				btn:{
    					success:"保存",
    					close:"关闭",
    				}
    			}
            };
			const nMath = this.math(6);
			this.config = $.extend(defaults, config);
			[this.model,this.sct,this.wat] = ["",`${this.config.select}_${nMath}`,`${this.config.wait}_${nMath}`];
    		if ($(model).is("[DataExchange]")) {
				$(model).removeAttr("DataExchange").attr(`DataExchange_${nMath}`,true);
    			this.model = $(`[DataExchange_${nMath}]`);
    		} else {
				$(model).attr(`DataExchange_${nMath}`,true);
				this.model = $(`[DataExchange_${nMath}]`);
    		}
    		this.info();
        }
		// 生成随机数
		math(n) {
			let chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
			let res = "";
			 for(let i = 0; i < n ; i ++) {
				 let id = Math.ceil(Math.random()*35);
				 res += chars[id];
			 }
			 return res;
		}
        // console.log
        log(msg) {
            try {
                if(this.config.debug){
                    console.log(msg);
                }
            } catch (e){
                return 'Error:the function  log is not exist.';
            }
        }
		prompt(msg){
            try {
                if(this.config.debug){
                    alert(msg);
                }
            } catch (e){
                return 'Error:the function  log is not exist.';
            }
		}
        // 数据展示
        body(body){
			let [n,maths,val,opt,opSed,rLeft,rRight,box,height] = [6,"","","","","","","",this.config.height];
    		for (let i = 0; i < this.config.language.info.labTEXT.length; i++) {
    			if (this.config.style.toLowerCase()==="bootstrap4") {
    				body.addClass("row");
					[rLeft,rRight,box] = [
						$('<div class="col-3"></div>'),
						$('<div class="col-9"></div>'),
						$('<div class="col-6"></div>')
					];
    			} else {
					[rLeft,rRight,box] = [
						$('<div class="col-md-3 col-sm-3 col-xs-3 ex-margin"></div>'),
						$('<div class="col-md-9 col-sm-9 col-xs-9 ex-margin"></div>'),
						$('<div class="col-md-6 col-sm-6 col-xs-6 ex-margin"></div>')
					];
    			}
    	        let all              = $('<button type="button" class="btn btn-primary">'+this.config.language.info.all+'</button>'),
    		    move_to_left_button  = $('<span class="glyphicon glyphicon-arrow-left" aria-hidden="true">◀</span>'),
    		    move_to_raght_button = $('<span class="glyphicon glyphicon-arrow-right" aria-hidden="true">▶</span>'),
    		    move_to_down_button  = $('<span class="glyphicon glyphicon-arrow-down" aria-hidden="true">▼</span>'),
    		    move_to_up_button    = $('<span class="glyphicon glyphicon-arrow-up" aria-hidden="true">▲</span>'),
    		    alternative          = $.grep(this.model.attr("data-in").split(','), (n)=> {return $.trim(n).length > 0;}),
    		    desc                 = $.grep(this.model.attr("data-name").split(','), (n)=> {return $.trim(n).length > 0;}),
    			select               = $('<select style="height:'+height+';" class="scroll select2_multiple form-control" multiple="multiple"></select>'),
    			data                 = $.ajax({url:this.config.url,async:false,success:(json)=>{return json;}}),
				json                 = data.responseJSON;
    	        body.append(box);
    			if (this.config.style.toLowerCase()==="bootstrap4") {
    				box.append($("<div class='row'></div>").append(rLeft.html('<center class="data-title">'+this.config.language.info.otnTEXT[i]+'</center>'))
    	            .append(rRight.html('<center class="data-title">'+this.config.language.info.labTEXT[i]+'</center>').append(select)));
    			} else {
    				box.append(rLeft.html('<center class="data-title">'+this.config.language.info.otnTEXT[i]+'</center>'))
    	            .append(rRight.html('<center class="data-title">'+this.config.language.info.labTEXT[i]+'</center>').append(select))
    			}

    	        if (this.config.allselcet) {
    	            rRight.append($(`<center style="margin-top:15px;"></center>`).append(all));
    	        }

    	        if (i===0||i==="0") {
    				this.setSubNav(this.sct,select,rLeft,move_to_up_button,move_to_down_button);
    	            opSed = this.select(json.rtData.selected,select,desc,alternative,opSed);
    			} else {
    				this.setSubNav(this.wat,select,rLeft,move_to_left_button,move_to_raght_button);
    				let waitAry = this.wait(json.rtData.disselected,select,desc,alternative,opt);
					[opt,val]   = [waitAry.arry,waitAry.parentArry];
    	        }

				let [sopt,sval,optiSed] = [opt.split(','),eval(`[${val}]`),opSed.split(',')];
				setTimeout(function(){
					let u = "";
					if (sopt.length > 0) {
						for (let s = 0; s < sopt.length; s++) {
							for (let v = 0;v < sval.length; v++) {
								if (sval[v].parentId === sopt[s]) {
									$(`[data-id="optgroup_${sopt[s]}"]`).append(`<option value="${sval[v].value}">${sval[v].text}</option>`);
								}
							}
						}
					}
					$(`[data-id="${this.wat}"]`).find("option").each(function(){
						u += $(this).val()+",";
					})
					let evalu = u.split(',');
					let arry = [];
					for (let l = 0; l < optiSed.length; l++) {
					   if($.inArray(optiSed[l] ,evalu) != -1){
							arry.push(optiSed[l]);
					   }
					}
					for (let l = 0; l < arry.length; l++) {
						if (arry[l]!="" && arry[l]!="undefined") {
							$(`[data-id="${this.wat}"]`).find(`option[value="${arry[l]}"]`).remove()
						}
					}
				});

				let [jsonSelected,date_wait,language,date_select,$textALL,$textALLDispel] = [
					json.rtData.selected,
					this.wat,
					this.config.language,
					this.sct,
					this.config.language.info.all,
					this.config.language.info.dispel
				]
    			move_to_left_button.on("click",()=>{
    				this.move_to_left_button(language,jsonSelected,date_wait,date_select);
    			});
    			move_to_raght_button.on("click",()=>{
    				this.move_to_raght_button(language,jsonSelected,date_wait,date_select,sopt,sval);
    		    });
    		    move_to_up_button.on("click",()=>{
    				this.move_to_up_button(language,date_select);
    		    });
    		    move_to_down_button.on("click",()=>{
    				this.move_to_down_button(language,date_select);
    		    });
				$(all).on("click",(e)=>{
					let text = $(all).html();
					if (text===$textALLDispel) {
						$(select).find("option").removeAttr("data-exhange");
						$(all).html($textALL);
					} else {
						$(select).find("option").attr("data-exhange",true);
						$(all).html($textALLDispel);
					}
				});
    	    }
        };
		// 上移动
		move_to_up_button(language,sel){
			let [not,ups] = [language.info.selcet.not,$(`[data-id="${sel}"]`).find("option:selected")];
			if(null === $(`[data-id="${sel}"]`).val()){
				this.prompt(not);
				return false;
			}
			if (ups.get(0).index > 0) {
				ups.each(function() {
					$(this).prev().before($(this));
				});
			}
			if (this.config.type==="page") {
				this.postData();
			}
		}
		// 下移动
		move_to_down_button(language,sel){
			const nexts      = $(`[data-id="${sel}"]`);
			const optn       = nexts.find("option");
			const sed        = nexts.find("option:selected");
			const optnLength = nexts[0].options.length;
			const not        = language.info.selcet.not;
			const optnIndex  = nexts.get(0).selectedIndex;
			if(null === nexts.val()){
				this.prompt(not);
				return false;
			}
			if (sed.get(sed.length - 1).index != optn.length - 1) {
				for (let i = sed.length - 1; i >= 0; i--) {
					const item = $(sed.get(i));
					item.insertAfter(item.next());
				}
			}
			if (this.config.type==="page") {
				this.postData();
			}
		}
		// 右移动
		move_to_raght_button(language,data,wai,sel,sopt,sval){
			let [optSed,sText,not,disSed,mg] = [
				$(`[data-id="${sel}"]`).find("option:selected"),
				language.info.selcet.iselect,
				language.info.selcet.not,
				$(`[data-id="${wai}"]`),""
			];
	        if (optSed.length<=0) {
				this.prompt(not);
	            return false;
	        } else {
				if (data.length>0) {
		            for (let i = 0; i < data.length; i++) {
						if (data[i].isMustSelect) {
							mg += `${data[i].value},`
						}
		            };
		        }
				let mgTrim = $.grep(mg.split(','), (n)=> {return $.trim(n).length > 0;}),
				inArryMg   = $.inArray(optSed.val(), mgTrim);
				if (inArryMg>=0) {
					this.prompt(sText);
				} else {
		            optSed.appendTo(disSed);
		        }
				if (sopt.length>0) {
		            optSed.each(function(){
		                for (let i = 0; i < sopt.length; i++) {
		                    for (let v = 0;v < sval.length; v++) {
		                        if ($(this).val()===sval[v].value) {
		                            if (sval[v].parentId === sopt[i]) {
		                                $(this).appendTo(disSed.find($(`[data-id="optgroup_${sopt[i]}"]`)));
		                            }
		                        }
		                    }
		                }
		            })
		        } else {
		            optSed.appendTo(disSed);
		        }
			}
			if (this.config.type==="page") {
				this.postData();
			}
		}
		// 左移动
		move_to_left_button(language,data,wai,sel){
			let [waitSub,sText,not,select] = [
				$(`[data-id="${wai}"]`).find("option:selected"),
				language.info.selcet.iselect,
				language.info.selcet.not,
				$(`[data-id="${sel}"]`)
			];
			if(waitSub.length <= 0){
				this.prompt(not);
				return false;
			} else {
				waitSub.appendTo(select);
			}
			if (this.config.type==="page") {
				this.postData();
			}
		}
		// add icon
		setSubNav(dataId,modular,rLeft,oBtn,tBtn){
			modular.attr("data-id",dataId).attr("name",dataId);
			rLeft.append(
				$('<center style="margin-top:70px;font-size: 20px;"></center>').append(oBtn)
			).append(
				$('<center style="font-size: 20px;"></span></center>').append(tBtn)
			);
		}
		// select main
		select(data,modular,text,ide,arry){
			for (let j = 0; j < data.length; j++) {
				let inArry   = $.inArray(data[j].value, ide);
				if (inArry<0) {
					ide.push(data[j].value);
					text.push(data[j].text);
				}
			}
			for (let i = 0; i < ide.length; i++) {
				let option = $('<option></option>');
				option.val(ide[i]).html(text[i]);
				arry += `${ide[i]},`;
				modular.append(option);
			}
			return arry;
		}
		// wait main
		wait(data,modular,text,ide,arry){
			let parentArry="",maths="";
			for (let j = 0; j < data.length; j++) {
				if (data[j].isParent === "1") {
					let optg = $(`<optgroup label="${data[j].text}" data-id="optgroup_${data[j].id}"></optgroup>`);
					maths    = data[j].id;
					modular.append(optg);
					arry += `${data[j].id},`;
				} else if (data[j].parentId === maths) {
				   parentArry += `{"parentId":"${data[j].parentId}","value":"${data[j].value}","text":"${data[j].text}"},`;
			   } else {
					let inArry = $.inArray(data[j].value, ide),
					option     = $('<option></option>');
					if (inArry<0) {
						option.val(data[j].value).html(data[j].text);
						arry += `${data[j].value},`;
						modular.append(option);
					}
				}
			}
			return {arry:arry,parentArry:parentArry};
		}
	    // 初始化页面
	    info(){
			let center = $("<div class='BootstrapDataExchange'></div>");
			if (this.config.type === "dialog") {
				this.dialog(this.model);
			} else {
				this.model.append(center);
				this.body(center);
			}
	    };
	    // 获取dialog模式模块
	    dialog(the){
			let modal = $('<div class="modal fade bs-example-modal-md" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel"></div>'),
			dialog    = $('<div class="modal-dialog modal-md" role="document"></div>'),
			content   = $('<div class="modal-content"></div>'),
			header    = $('<div class="modal-header"></div>'),
			body      = $('<div class="modal-body"></div>'),
			footer    = $('<div class="modal-footer"></div>'),
			closeBtn  = $('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>'),
			subBtn    = $('<button type="button" class="btn btn-primary">'+this.config.language.btn.success+'</button>'),
			closBtn   = $('<button type="button" class="btn btn-default" data-dismiss="modal" aria-label="Close">'+this.config.language.btn.close+'</button>');
			modal.append(dialog.append(content.append(header).append(body).append(footer.append(subBtn).append(closBtn))));
			$("body").append(modal);
			header.append(`<h4 class="modal-title">${this.config.title}</h4>`).append(closeBtn);
			this.body(body);
			modal.modal();
			closBtn.click(()=>{
				$(".modal-backdrop").fadeTo();
				modal.fadeTo();
				setTimeout(()=>{
					$(".modal-backdrop").remove();
					modal.remove();
				},500);
			});
			subBtn.click(()=>{
				this.postData();
				$(closBtn).trigger("click");
		    });
        }
		postData(){
	        let check = $(`[data-id="${this.sct}"]`).find('option'),
			text      = "",
			ids       = "";
	        check.each(function(){
	            text += $(this).text()+",";
	            ids  += $(this).val()+",";
	        });
			$(this.model).attr("data-in",ids.substring(0,ids.length-1)).attr("data-name",text.substring(0,text.length-1));
		}
    };

    // 调用config
    $.fn.bootstrapDataExchange = function(config){
        return new BootstrapDataExchange(config,$(this));
    };
}))
