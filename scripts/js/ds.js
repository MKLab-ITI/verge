/*-----------------------------------------------shotDS-------------------------------------------------*/
shotDS = new kendo.data.DataSource({
    transport: {
    	read: {
        	url: livesite+"api/"+apiVersion+"/verge/shots",
            type: "GET",
            complete: function(e){
	            console.log(e);
            }
        }
    },
    serverSorting: true,
    serverFiltering: true,
    filter: {
		logic: "and",
		filters: [
			{ field: "shot", operator: "zoom", value: zoom },
		]
	},
    serverPaging: true,
    pageSize: 500,
    page:page,
    schema: {
    	total: "total",
        data: "data",
        model: {
        	id: "id",
			fields: {
            	id: {validation: { required: false}}
        	}
        }
    },
    requestEnd: function(e){
		loaded();
  	},
    change: function(e){
	    //mode = false;
	    $(".query_type").html("Sequential search");
    	$("#total").html("Total: "+e.sender._total);
    	$("#page").html("Page: "+page);
    	
    	if( e.items.length <= 0 ){
	    	video++;
	    	videoSlider.trigger("change", { value: Math.abs( video - 244)  } );
    	}
		else{
			$(".nav_video").html("Video: "+ e.items[0]['video'] );	
		}
		$(".magnifier").animate({
		    "bottom": parseInt( $(".timeline .k-slider-selection").css("height").replace("px","") )+window.innerHeight*0.18+"px"
		});

    	if($(".box").length>1500){//TODO this release browser's overloading and it should be extended with scrollToTop functionality
	    	$(".files").html('');
	    	$("#videoListView").html("");
    	}			    

  		var boxTMPL = kendo.template($("#boxTMPL").html());
		if(load=="more"){
						
			$.each(e.items, function( index, value ) {
			  $("#videoListView").append(boxTMPL({
					id: this.id,
					video: this.video,
					name: this.name,
					shot: this.shot,
					scene: this.scene,
					sizeFolder: sizeFolder
				}));
			});
			
		}
		else{
			i=e.items.length-1;
			do {
				var imgData ={
					id: e.items[i]['id'],
					video: e.items[i]['video'],
					name: e.items[i]['name'],
					shot: e.items[i]['shot'],
					scene: e.items[i]['scene'],
					sizeFolder: sizeFolder
				};
				$("#videoListView").prepend(boxTMPL(imgData));
			    i--;
			}
			while (i > 0);

		}
		
		if( slider.value() < 6 ){
/*
			$(".box").kendoTooltip({
			    filter: "img",
				content: kendo.template($("#image_preview").html()),
				show: function(e){

				},
				position: "top"
			});    
*/
	    }
	    else{
		    //$(".box").data("kendoTooltip").destroy();
	    }
	    init();
    }
});
var ds = shotDS;//initialize ds variable
/*--------------------------------------------shotDS-------------------------------------------------------*/
/*-----------------------------------------------conceptDS-------------------------------------------------*/
conceptDS = new kendo.data.DataSource({
    transport: {
    	read: {
        	url: livesite+"api/"+apiVersion+"/verge/concept_sort",
            type: "GET",
            complete: function(e){
	            //console.log(e);
            }
        }
    },
    serverSorting: true,
    sort: conceptFilter,
    serverFiltering: true,
    serverPaging: true,
    pageSize: 500,
    page:page,
    schema: {
    	total: "total",
        data: "data",
        model: {
        	id: "id",
			fields: {
            	id: {validation: { required: false}}
        	}
        }
    },
    requestEnd: function(e){
		loaded();
	},
    change: function(e){	    
	    $(".query_type").html("Concept search");
    	$("#total").html("Total: "+e.sender._total);
    	$("#page").html("Page: "+page);
    	
    	$(".nav_video").html("Video: "+ e.items[0]['video'] );
    	
    	if($(".box").length>1500){
	    	$(".files").html('');
	    	$("#videoListView").html("");
    	}
    	
    	var boxTMPL = kendo.template($("#boxTMPL").html());
		if(load=="more"){
			$.each(e.items, function( index, value ) {
			  $("#videoListView").append(boxTMPL({
					id: this.id,
					video: this.video,
					name: this.name,//kendo.toString( this.id, '000000')
					shot: this.shot,
					scene: this.scene,
					sizeFolder: sizeFolder
				}));
			});	
		}
		else{
			i=e.items.length-1;
			do {
				var imgData ={
					id: e.items[i]['id'],
					video: e.items[i]['video'],
					name: e.items[i]['name'],
					shot: e.items[i]['shot'],
					scene: e.items[i]['scene'],
					sizeFolder: sizeFolder
				};
				$("#videoListView").prepend(boxTMPL(imgData));
			    i--;
			}
			while (i > 0);

		}
		
		if( slider.value() < 6 ){
/*
			$(".box").kendoTooltip({
			    filter: "img",
				content: kendo.template($("#image_preview").html()),
				show: function(e){
				//console.log(e);
			},
			position: "top"
			});   
*/ 
	    }
	    else{
		    //$(".box").data("kendoTooltip").destroy();
	    }
	    init();
    }
});
/*--------------------------------------------conceptDS----------------------------------------------------*/





/*-----------------------------------------------scenesDS-------------------------------------------------*/
scenesDS = new kendo.data.DataSource({
    transport: {
    	read: {
        	url: livesite+"api/"+apiVersion+"/scenes",
            type: "GET",
            complete: function(e){
	            //console.log(e);
            }
        }
    },
    serverSorting: true,
    serverFiltering: true,
    serverPaging: true,
    pageSize: 500,
    page:page,
    schema: {
    	total: "total",
        data: "data",
        model: {
        	id: "id",
			fields: {
            	id: {validation: { required: false}}
        	}
        }
    },
    requestEnd: function(e){
		loaded();
  	},
    change: function(e){
    	$("#total").html(e.sender._total);
    	$(".nav_video").html("Video: "+ e.items[0]['video'] );
    	
    	if($(".box").length>1500){//TODO this release browser's overloading and it should be extended with scrollToTop functionality
	    	$(".files").html('');
	    	$("#videoListView").html("");
    	}
    	
    	//$("#videoListView").append("<div class='box file_image' style='width:"+slider.value()+"vw;' ><img id='"+e.items[i]['id']+"' data-video='"+e.items[i]['video']+"' data-shot='"+e.items[i]['shot']+"' src='../../Project_Images/TREC_VO/2013/"+image_size+"/"+e.items[i]['path']+"/"+e.items[i]['name']+" '/></div>");   			    

  		var boxTMPL = kendo.template($("#boxTMPL").html());
		if(load=="more"){
			i=0;
			do {
				var imgData ={
					id: e.items[i]['id'],
					video: e.items[i]['video'],
					name: e.items[i]['name'],
					shot: e.items[i]['shot'],
					scene: e.items[i]['scene'],
					sizeFolder: sizeFolder
				};
				$("#videoListView").append(boxTMPL(imgData));
			    i++;
			}
			while (i < e.items.length);	
		}
		else{
			i=e.items.length-1;
			do {
				var imgData ={
					id: e.items[i]['id'],
					video: e.items[i]['video'],
					name: e.items[i]['name'],
					shot: e.items[i]['shot'],
					scene: e.items[i]['scene'],
					sizeFolder: sizeFolder
				};
				$("#videoListView").prepend(boxTMPL(imgData));
			    i--;
			}
			while (i > 0);
		}
		
		if( slider.value() < 6 ){
/*
			$(".box").kendoTooltip({
			    filter: "img",
				content: kendo.template($("#image_preview").html()),
				show: function(e){
				//console.log(e);
			},
			position: "top"
			}); 
*/   
	    }
	    else{
		    //$(".box").data("kendoTooltip").destroy();
	    }
    }
});
/*--------------------------------------------scenesDS----------------------------------------------------*/
/*-----------------------------------------------topicsDS-------------------------------------------------*/
topicsDS = new kendo.data.DataSource({
    transport: {
    	read: {
        	url: livesite+"api/"+apiVersion+"/trec2015/topics",
            type: "GET",
            complete: function(e){
	            //console.log(e);
            }
        }
    },
    serverSorting: true,
    serverFiltering: true,
    serverPaging: true,
    pageSize: 500,
    page:page,
    schema: {
    	total: "total",
        data: "data",
        model: {
        	id: "id",
			fields: {
            	id: {validation: { required: false}}
        	}
        }
    },
    requestEnd: function(e){
	    
  	},
    change: function(e){
	    
		//console.log(e);  
		
		$.each(e.items, function( index, value ) {
			number = index+1;
			$(".navigation").append("<div class='topic col-md-12' data-num="+this.num+" >"+number+". "+this.text+"</div>");	
		});	  	
    	  			    
    }
});
/*--------------------------------------------topicsDS----------------------------------------------------*/