/*--------------------------------------------Global Functions & Vars----------------------------------------------------*/
var min = new Date().getTime();
var isLoading = false;
var lastRequestTimestamp = 0;
var $window = $(window);
var $document = $(document);
var page = 1;
var pageSize = 100;
var conceptFilter = new Array();
var loadOnScrollMode = true;
var i = 0;
var poso = 0;
var myInterval;
baseImagesPath = 'http://mklab-services.iti.gr/Project_Images/TREC_VO/2013/';
oldWrapPos = 0;
var load = "more";
var sizeFolder = 200;
var video = 1;
var jcrop_api = null;
var newboxTMPL = kendo.template($("#newboxTMPL").html());
var selectedShots = Array();
var selectedClass = "";
var zoom = 5;
indexPath = [
	"D:/TomCatServices/IndexingService/index/",
	"D:/TomCatServices/IndexingService/salSift100k_index/"
];			
desc = "sss";

/***************************** router *************************/
var router = new kendo.Router();
router.route("/", function() {
	//console.log("/ url was loaded");
});
router.route("/items/:category/:id", function(category, id) {
    //console.log(category, "item with", id, " was requested");
});
/***************************** router *************************/

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

/* youtube loading effect */
anim = 'la-anim-1';
animEl = document.querySelector( '.' + anim );
function loadEffect(sec){
	classie.add( animEl, 'la-animate' );
	$('.la-animate').css({
		'transition': 'transform '+sec+'s linear, opacity 1s '+sec+'s'
	});
	setTimeout(function(){ 
		//location.assign("./");
	}, sec*1000+2000);
}
/* youtube loading effect */

/* loading effect */
anim10 = 'la-anim-10';
animEl10 = document.querySelector( '.' + anim10 );

function loadin(){
	isLoading = true;
	classie.add( animEl10, 'la-animate' );
}
function loaded(){
	isLoading = false;
	classie.remove( animEl10, 'la-animate' );
}
/* loading effect */

function clearSearchResults(){
	loadin();
	clearInterval(myInterval);
	$(".files").html('');
	$("#videoListView").html("");
	page = 1;
	oldWrapPos = 0;
}

$(".exit").click(function(){
	location.assign("./index.php");
});

$(".logo").click(function(){
	location.reload();
});

$('#reset').click( function(){
	//$(".basket").slideUp();
	$(".basket").animate({bottom: '0px'});
	$(".uploadedImages").children().remove();
	
});

$("#visualSimilarityDropTarget").kendoDropTarget({
	dragenter: function(e){
		$("#visualSimilarityDropTarget").css({
			'border': '2px dashed #c3c3c3'
	    });
    },
    dragleave: function(e){
		$("#visualSimilarityDropTarget").css({
			'border': 'none'
	    });
    },
    drop: function(e){		    
	    $(".uploadedImages").append("<div class='upbox'><span class='deleteMe'><i class='fa fa-times'></i></span><img class='thumbnail' src='http://mklab-services.iti.gr/Project_Images/TREC_VO/2015/243Videos_Frames/"+kendo.toString( e.target.id*1, '000000')+".jpg'><a class='colorbox zoomer' data-name='"+e.target.id+".jpg' data-dir='http://mklab-services.iti.gr/Project_Images/TREC_VO/2015/576x432/' href='http://mklab-services.iti.gr/Project_Images/TREC_VO/2015/576x432/"+e.target.id+".jpg' ><svg x='0' y='0' width='24px' height='24px' viewBox='0 0 24 24' aria-label='Open' role='button' tabindex='0' title='Open' jsaction='click:eQuaEb'><path d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z' fill='rgba(255, 255, 255, 1)' stroke='none'></path><path d='M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z' fill='rgba(255, 255, 255, 1)' stroke='none'></path></svg></a></div>");
	    
	    $("#visualSimilarityDropTarget").css({
			'border': 'none'
	    });
	    init();
    }
});

$("#droptarget").kendoDropTarget({
    dragenter: function(e){
		$("#droptarget").css({
	    	'border': '2px solid #c3c3c3'
		});
    },
    dragleave: function(e){
	    //console.log(e);
	    $("#droptarget").css({
	    	'border': 'none'
		});
    },
    drop: function(e){
	    $("#droptarget").css({
	    	'border': 'none'
		});
		$("#droptarget").html(e.target);
	}
});

$("body").on("click", ".navmenu", function(){
	$(this).toggleClass("active");
    $('.navigation').toggle('slide',{direction:'left'}, 200);
});

function callMyScene(video,scene){
	$('.info-cl').html("<div class='row loader'><img src='http://mklab-services.iti.gr/plugins/kendo/2014.3.1119/styles/MaterialBlack/loading-image.gif'></div>");
	sceneDS = new kendo.data.DataSource({
	    transport: {
	    	read: {
	        	url: livesite+"api/"+apiVersion+"/scene/"+video+"/"+scene,
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
		    //console.log(e);
			$(".info-cl").html("<div class='row shots_title col-md-12'><span>Video: "+e.items[0]['video']+" Scene: "+e.items[0]['scene']+"  Shots: "+e.sender._total+"</span></div><div class='xclose row col-md-6'><i id='close' class='fa fa-times'></i></div><div class='row col-md-12 shots'></div>");
			var iboxTMPL = kendo.template($("#iboxTMPL").html());
			i=0;
			do {
				if( $.inArray( "shot"+e.items[i]['video'].toString()+"_"+e.items[i]['shot'].toString() , selectedShots ) >= 0 ){
					selectedClass = "selected";
				}
				else{
					selectedClass = " ";
				}
				var imgData ={
					id: e.items[i]['id'],
					video: e.items[i]['video'],
					name: e.items[i]['name'],
					shot: e.items[i]['shot'],
					scene: e.items[i]['scene'],
					selectedClass: selectedClass
				};
				
				$(".info-cl .shots").append(iboxTMPL(imgData));
				
			    i++;
			}
			while (i < e.items.length);
			init();
	    }
	});
	sceneDS.read();
}

function callMySceneByMyId(id){
	
	$('.info-cl').html("<div class='row loader'><img src='../plugins/kendo/2014.3.1119/styles/MaterialBlack/loading-image.gif'></div>");
	//console.log("Video: "+video+" Scene: "+scene);
	mysceneDS = new kendo.data.DataSource({
	    transport: {
	    	read: {
	        	url: livesite+"api/"+apiVersion+"/myscene/"+id,
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
		    //console.log(e);
			$(".info-cl").html("<div class='row shots_title col-md-12'><span>Video: "+e.items[0]['video']+" Scene: "+e.items[0]['scene']+"  Shots: "+e.sender._total+"</span></div><div class='xclose row col-md-6'><i id='close' class='fa fa-times'></i></div><div class='row col-md-12 shots'></div>");
			var iboxTMPL = kendo.template($("#iboxTMPL").html());
			i=0;
			do {
				if( $.inArray( "shot"+e.items[i]['video'].toString()+"_"+e.items[i]['shot'].toString() , selectedShots ) >= 0 ){
					selectedClass = "selected";
				}
				else{
					selectedClass = " ";
				}
				var imgData ={
					id: e.items[i]['id'],
					video: e.items[i]['video'],
					name: e.items[i]['name'],
					shot: e.items[i]['shot'],
					scene: e.items[i]['scene'],
					selectedClass: selectedClass
				};
				$(".info-cl .shots").append(iboxTMPL(imgData));
			    i++;
			}
			while (i < e.items.length);
			init();
	    }
	});
	mysceneDS.read();
}

function enableCropping(){
		
	$(".cropBarTop").animate({
		top: "0px"
	});
	$(".cropBarBottom").animate({
		bottom: "0px"
	});
	
	if(jcrop_api!=null){
		jcrop_api.destroy();	
	}
	$('.cboxPhoto').Jcrop({
        onChange: function(e){
	       $("#cropW").val("W: "+e.w);
	       $("#cropH").val("H: "+e.h);
	       $("#cropX").val("X: "+e.x);
	       $("#cropY").val("Y: "+e.y);
        },
		onSelect: function(e){
			cropImg = {
				'dir': $(".cboxPhoto").attr('dir'),
				'img': $(".cboxPhoto").attr('name'),
				'x': e.x,
				'y': e.y,
				'w': e.w,
				'h': e.h,
			};			
		},
		onRelease: function(e){

		}
      },function(){
        jcrop_api = this;
    });
}

function cropit(){

	$.ajax({
		url: livesite+"api/"+apiVersion+"/crop",
		method: "POST",
		data: cropImg,
		success: function(e){
			$(".croppedImages").append("<img class='thumbnail' src='http://mklab-services.iti.gr/verge/camera_shots/"+e+"'>");
		},
		error: function(e){
			//console.log(e);
		}
		}).done(function(e){
			//console.log(e);	
	});
}

function submitCroppedImages(){
	$.colorbox.close();
	clearSearchResults();
			
			croppedImages = [];
			$(".croppedImages img").each(function() {
			    croppedImages.push( absolutePath+$(this).attr('src') );
			});
			
			params = {
				indexPath: indexPath,
				queryPath: croppedImages,
				desc: desc
			};
			
			$.ajax({
				url: "http://160.40.51.22:8080/IndexingService/indexing/service",
				method: "GET",
				data: params,
				success: function(e){
					//console.log(e);
					loaded();
				    loadOnScrollMode = false;
					$.each(e, function( index, value ) {
						$("#videoListView").append(newboxTMPL({
							id: value*1,
							name: "http://mklab-services.iti.gr/Project_Images/TREC_VO/2015/243Videos_Frames/"+value+".jpg",//kendo.toString( this.id, '000000')
						}));
					});
					init();					
				},
				error: function(e){
					//console.log(e);
				}
			}).done(function() {
				  //$( this ).addClass( "done" );
			});
}

function visualSimilarityUploadedImages(){
	clearSearchResults();
	
			images = [];
			$(".uploadedImages img").each(function() {
			    images.push( absolutePath+$(this).attr('src') );
			});	
			
			params = {
				indexPath: indexPath,
				queryPath: images,
				desc: desc
			};
			
			$.ajax({
				url: "http://160.40.51.22:8080/IndexingService/indexing/service",
				method: "GET",
				data: params,
				success: function(e){
					//console.log(e);
					loaded();
					
					$(".basket").animate({bottom: '0px'});
					
					$(".query_type").html("Visualy similar");
					$("#total").html("Total results: "+e.length);
					loadOnScrollMode = false;
					
					$.each(e, function( index, value ) {
						
						//console.log(value);
						
						$("#videoListView").append(newboxTMPL({
							id: value*1,
							video: 1,
							name: "http://mklab-services.iti.gr/Project_Images/TREC_VO/2015/243Videos_Frames/"+value+".jpg",//kendo.toString( this.id, '000000')
						}));
					});
					init();
				},
				error: function(e){
					//console.log(e);
				}
			}).done(function() {
				  //$( this ).addClass( "done" );
			});
}


function opensesame(containerID){
	
	if( !$('.opened').children().hasClass("arrow") ){
		$('.opened').append('<div class="arrow"></div>');	
	}
	var selectedPos = $('.opened').index();
	var elementsInRow = Math.floor( $("#"+containerID).width() / $('.box').outerWidth() );//100 = .box's width (without padding)
	var row = Math.floor(selectedPos / elementsInRow)+1;
	var wrapPos = (row * elementsInRow);
	var size = $("#"+containerID).children().length-1;	
	if (wrapPos >= size){wrapPos = size;}
	wrapPos = wrapPos - 1;
		
	if (wrapPos == oldWrapPos){
	    $('.info-bg').slideDown();
	} 
	else{
		oldWrapPos = wrapPos;
	    $("#"+containerID).children().removeClass('edge');	    
	    $($("#"+containerID).children(".box")[wrapPos]).addClass('edge');
	    $('.info-bg').slideUp( function() { $(this).remove(); });
	    $('.edge').after('<div class="info-bg"><div class="info-cl"></div></div>');
	    $('.info-bg').slideDown('fast');
	        
	    $(".info-cl").mousewheel(function(event, delta) {
	    	this.scrollLeft -= (delta * 30);
		    event.preventDefault();
		});
    }

    if( typeof $(".opened").children().first().data("scene") === 'undefined'  ){
		callMySceneByMyId( $(".opened").children().first().attr("id") );    
    }
    else{
	    callMyScene( $(".opened").children().first().data("video"), $(".opened").children().first().data("scene") );
    }
}

/*--------------------------------------------Global Functions & Vars----------------------------------------------------*/