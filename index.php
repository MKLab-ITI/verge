<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta charset="UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="VERGE | Video Search Engine">
    <meta name="author" content="mironidis@iti.gr">
    <link rel="icon" href="favicon.png">
    <title>VERGE | Video Search Engine </title>
    <script>
	    absolutePath = "D:/Services/xampp/htdocs/trec2015_v1/";
	    livesite = "http://mklab-services.iti.gr/verge/"; 
	    apiVersion = "v1.2";
	    time = "15";	 
	    time = time*60;//seconds!
	    desc = "<?php $desc = isset($_GET['desc']) ? $_GET['desc'] : "ssss"; echo $desc;  ?>";
	    user = "<?php $user = isset($_GET['user']) ? $_GET['user'] : "kanenas"; echo $user;  ?>";
    </script>
</head>
<body>
	<nav class="cropBarTop navbar navbar-default navbar-fixed-top">
	  <div class="container-fluid">
	    <div class="navbar-header">
	      <a class="navbar-brand" href="#">Object Detection Tool</a>
	    </div>	    	
	      <div class="navbar-form" role="search" style="float: right;">
	        <input id="cropW" type="text" class="form-control" placeholder="width" style="width: 70px;" disabled="true">
	        <input id="cropH" type="text" class="form-control" placeholder="height" style="width: 70px;" disabled="true">
	        <input id="cropX" type="text" class="form-control" placeholder="width" style="width: 70px;" disabled="true">
	        <input id="cropY" type="text" class="form-control" placeholder="height" style="width: 70px;" disabled="true">
	      </div>
	    </div><!-- /.navbar-collapse -->
	  </div><!-- /.container-fluid -->
	</nav>
	
	<nav class="cropBarBottom navbar navbar-default navbar-fixed-bottom">
	  <div class="container-fluid">    	
	      <div class="navbar-form" role="search" align="center">

			<div class="col-md-8 croppedImages">
			
			</div>
	        <div class="form-group col-md-4" style="float:right;">
	          <button onclick="cropit()" type="submit" class="btn btn-primary">Crop</button>
	          <button style="float:right;" onclick="submitCroppedImages()" type="submit" class="btn btn-success">RUN</button>
	        </div>
	        
	      </div>
	    </div><!-- /.navbar-collapse -->
	  </div><!-- /.container-fluid -->
	</nav>
	
	<nav class="selectedBar navbar navbar-default navbar-fixed-top">
	  <div class="container-fluid">
	    <div class="navbar-header">
	      <a class="navbar-brand" href="#"><span id="selected"></span> selected</a>
	    </div>	 
	    
	    <div class="row col-md-8">
	    
	    </div>
	    
	    <div class="row col-md-2 countdown">
			<i class="fa fa-clock-o"></i><span class='countdownTime'></span>
		</div>
		   	
	      <div class="navbar-form">
	        <button id="submit" style="float:right;" type="submit" class="btn btn-success">Submit</button>
	        <button style="float:right; margin-right: 5px;" class="btn btn-danger">Reset</button>
	      </div>
	    </div><!-- /.navbar-collapse -->
	  </div><!-- /.container-fluid -->
	</nav>
	
		
	<div class="row top col-md-12">	
		<div class="col-sm-1 col-md-1 navmenu">
			<a class="bt-menu-trigger"><span>Menu</span></a>
		</div>
		<div class="logo col-sm-1 col-md-1">
			<h2>VERGE</h2>
		</div>	
		
		<div class="toolbar col-sm-5 col-md-5">
			<div class="row col-md-12 search">
			<div class="col-md-6 search_input">
				
				<div class="input-group">
				  <select id="search" data-placeholder="Select concept..." ></select>
				  <div id="files" class="files"></div>
				  <div id="progress" class="progress">
				      <div class="progress-bar progress-bar-success"></div>
				  </div>
			      <span class="input-group-btn">
			      	<span class="btn btn-default fileinput-button">
				        <i class="fa fa-camera"></i>
				        <input id="fileupload" type="file" name="files[]" multiple>
				    </span>
			      </span>
			    </div>
			    
    		<div class="results_info">
	    	<span class="query_type">  </span>
	    	
	    	<span id='page'>Page: 1</span>
	    	<span id='total'>Total Results: </span>
    		
    		</div>
    		</div>
			
			<div class="col-md-6">
		    <div id="droptarget" class="k-header">Visual Similarity search..</div>
			</div>
			
			<div class="row col-md-6" style="padding-top: 5px;">
			<i class="fa fa-picture-o" style="vertical-align: top;padding-top: 6px;"></i>
			<input id="slider" class="balSlider" />             
			<i class="fa fa-picture-o" style="vertical-align: top;font-size: 2em;"></i>   
			</div>
			
			</div>
		</div>
		
		<div class="row col-md-1">
			<label >Selected Shots<input id="selectedSwitcher" type="checkbox" class="ios-switch green  bigswitch" /><div><div></div></div></label>
		</div>
		
		<div class="row col-md-1 countdown">
			<i class="fa fa-clock-o"></i><span class='countdownTime'></span>
		</div>
			
		<div class="row col-md-1 exit">
			<i class="fa fa-power-off"></i>
		</div>
		
		<div class="row col-md-1 emenu" >
				<span id="selectAlgorithm"></span>
				<!-- <i class="fa fa-ellipsis-v"></i> -->
		</div>
		
		<div class="la-anim-1"></div>
		<div class="la-anim-10"></div>
	</div>		
	
	<script type="text/x-kendo-tmpl" id="conceptItemTemplate">
        <div class="concept">
            #: name #
        </div>
    </script>
    
	<div class="row col-md-2 navigation" >	
		
		<h3>Topics</h3>
		
	</div>
	
	<div class="row main col-md-12">	
		
		<div class="container" id="selectedShotsView" ></div>
		<div class="container" id="videoListView" ></div>
		
		<button id="loadmore" class="k-primary"> Show more results </button>
		<!-- <div id="pager" class="k-pager-wrap"></div> -->
	</div>
	<div class="timeline">
		
		<input class="videoSlider" value="243" />
		
		<div class="magnifier">
			<div class="nav_video">Video: </div>
			<span class="nav_arrow"> </span>
		</div>
	</div>
	<div class="guard"></div>
	
	<div class="row basket col-md-12">
		<span class="openMe"><i class="fa fa-photo"></i></span>
		<div id='visualSimilarityDropTarget' class="col-md-10 uploadedImages">
		<!-- <div id='start_frame' class="frames">start</div> -->		
		</div>
		
		<div class="buttons col-md-2">
		<button id='submit' type="button" onclick="visualSimilarityUploadedImages()" class="btn btn-primary btn-lg">RUN</button>
		<button id="reset" type="button" class="btn btn-warning btn-lg">RESET</button>
		</div>
	</div>
	
<script type="text/x-kendo-template" id="boxTMPL">
    <div class="box file_image" style='width:#: slider.value()+5 #vw;' >
	    <img href="http://mklab-services.iti.gr/Project_Images/TREC_VO/2015/576x432/#: id #.jpg" id="#: id #" data-video="#: video #" data-name="#: id #.jpg" data-scene="#: scene #" data-shot="#: shot #" src="http://mklab-services.iti.gr/Project_Images/Trecvid/2013/images/#: video #/#: name # ">
		<div class="col-cv-select">
			<div class="col-list-checkbox"></div>
		</div>
		
		<a class="colorbox zoomer" data-dir='../../../Project_Images/TREC_VO/2015/576x432/' data-name="#: id #.jpg" href="http://mklab-services.iti.gr/Project_Images/TREC_VO/2015/576x432/#: id #.jpg" >
		<svg x="0" y="0" width="24px" height="24px" viewBox="0 0 24 24" aria-label="Open" role="button" tabindex="0" title="Open" jsaction="click:eQuaEb"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="rgba(255, 255, 255, 1)" stroke="none"></path><path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z" fill="rgba(255, 255, 255, 1)" stroke="none"></path>
		</svg>
		</a>		
		<span class="sesame">
			<i class="fa fa-plus"></i>
		</span>
	</div>
</script>

<script type="text/x-kendo-template" id="newboxTMPL">
    <div class="box file_image" style='width:#: slider.value()+5 #vw;' >
	    <img href="#: name #" id="#: id #" data-name="#: name #" src="#: name # ">
		<div class="col-cv-select">
			<div class="col-list-checkbox"></div>
		</div>
		
		<a class="colorbox zoomer" data-dir='../../../Project_Images/TREC_VO/2015/576x432/' data-name="#: id #.jpg" href="#: name #" >
		<svg x="0" y="0" width="24px" height="24px" viewBox="0 0 24 24" aria-label="Open" role="button" tabindex="0" title="Open" jsaction="click:eQuaEb"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="rgba(255, 255, 255, 1)" stroke="none"></path><path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z" fill="rgba(255, 255, 255, 1)" stroke="none"></path>
		</svg>
		</a>
		<span class="sesame">
			<i class="fa fa-plus"></i>
		</span>
	</div>
</script>

<script type="text/x-kendo-template" id="iboxTMPL">
    <div class="file_image scene #: selectedClass # ">
	    <img href="http://mklab-services.iti.gr/Project_Images/TREC_VO/2015/576x432/#: id #.jpg" id="#: id #" data-video="#: video #" data-name="#: id #.jpg" data-scene="#: scene #" data-shot="#: shot #" src="http://mklab-services.iti.gr/Project_Images/Trecvid/2013/images/#: video #/#: name # ">
		<div class="col-cv-select">
			<div class="col-list-checkbox"></div>
		</div>
		
	<a class="colorbox zoomer" data-dir='../../../Project_Images/TREC_VO/2015/576x432/' data-name="#: id #.jpg" href="http://mklab-services.iti.gr/Project_Images/TREC_VO/2015/576x432/#: id #.jpg">
		<svg x="0" y="0" width="24px" height="24px" viewBox="0 0 24 24" aria-label="Open" role="button" tabindex="0" title="Open" jsaction="click:eQuaEb"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="rgba(255, 255, 255, 1)" stroke="none"></path><path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z" fill="rgba(255, 255, 255, 1)" stroke="none"></path>
	</svg>
	</a>
	</div>
</script>

<script id="image_preview" type="text/x-kendo-template">
	<img src="http://mklab-services.iti.gr/Project_Images/Trecvid/2013/images/#= target.data('video') #/#=target.data('shot')#.jpg" />
	<div> Video: #: target.data('video') #  </div>
</script>

</body>

<!-- Le css================================================== -->
<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" rel="stylesheet" integrity="sha256-MfvZlkHCEqatNoGiOXveE8FIwMzZg4W85qfrfIFBfYc= sha512-dTfge/zgoMYpP7QbHy4gWMEGsbsdZeCXz7irItjcC3sPUFtf0kuFbDz/ixG7ArTxmDjLXDmezHubeNikyKGVyQ==" crossorigin="anonymous">
<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha256-k2/8zcNbxVIh5mnQ52A0r3a6jAgMGxFJFE2707UxGCk= sha512-ZV9KawG2Legkwp3nAlxLIVFudTauWuBpC10uEafMHYL0Sarrz5A7G79kXh5+5+woxQ5HM559XX2UZjMJ36Wplg==" crossorigin="anonymous">
<link href="http://mklab-services.iti.gr/plugins/kendo/2015.1.318.core/styles/kendo.common.min.css" rel="stylesheet">
<link id="style" href="http://mklab-services.iti.gr/plugins/kendo/2015.1.318.core/styles/kendo.material.min.css" rel="stylesheet">
<link rel="stylesheet" href="http://mklab-services.iti.gr/plugins/jquery/jQuery-File-Upload-9.8.1/css/style.css">
<link rel="stylesheet" href="http://mklab-services.iti.gr/plugins/jquery/jQuery-File-Upload-9.8.1/css/jquery.fileupload.css">
<link href="http://mklab-services.iti.gr/plugins/jquery/jcrop/jquery.Jcrop.min.css" type="text/css" rel="stylesheet">
<link href="http://mklab-services.iti.gr/plugins/colorbox/miro/colorbox.css" type="text/css" rel="stylesheet">
<link href="scripts/css/style.css" type="text/css" rel="stylesheet"/>
<!--JavaScript================================================== -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script src="https://code.jquery.com/ui/1.11.1/jquery-ui.min.js" type="text/javascript"></script>
<script src="http://mklab-services.iti.gr/plugins/jquery/jquery.countdown.package-2.0.1/jquery.plugin.min.js" type="text/javascript"></script>
<script src="http://mklab-services.iti.gr/plugins/jquery/jquery.countdown.package-2.0.1/jquery.countdown.min.js" type="text/javascript"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js" integrity="sha256-Sk3nkD6mLTMOF0EOpNtsIry+s1CsaqQC1rVLTAy+0yc= sha512-K1qjQ+NcF2TYO/eI3M6v8EiNYZfA95pQumfvcVrTHtwQVDG+aHRqLi/ETn2uB+1JqwYqVG3LIvdm9lj6imS/pQ==" crossorigin="anonymous"></script>
<script src="http://mklab-services.iti.gr/plugins/kendo/2015.1.318.core/js/kendo.core.min.js" type="text/javascript"></script>
<script src="http://mklab-services.iti.gr/plugins/kendo/2015.1.318.core/js/kendo.ui.core.min.js" type="text/javascript"></script>
<script src="http://mklab-services.iti.gr/plugins/templates/CreativeLoadingEffects/js/classie.js"></script>
<script src="http://mklab-services.iti.gr/plugins/jquery/jQuery-File-Upload-9.8.1/js/vendor/jquery.ui.widget.js"></script>
<script src="http://mklab-services.iti.gr/plugins/jquery/jQuery-File-Upload-9.8.1/js/jquery.iframe-transport.js"></script>
<script src="http://mklab-services.iti.gr/plugins/jquery/jQuery-File-Upload-9.8.1/js/jquery.fileupload.js"></script>
<script src="http://mklab-services.iti.gr/plugins/jquery/jquery.mousewheel.js"></script>
<script src="http://mklab-services.iti.gr/plugins/jquery/jcrop/jquery.Jcrop.min.js"></script>
<script src="scripts/js/global.js" type="text/javascript"></script>
<script src="http://mklab-services.iti.gr/plugins/colorbox/miro/jquery.colorbox.js"></script>
<script src="scripts/js/ds.js" type="text/javascript"></script>
<script src="scripts/js/ready.js" type="text/javascript"></script>
<html>