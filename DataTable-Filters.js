Sortowanie tabeli LIVE


$.fn.dataTable.ext.search.push(
    function( settings, data, dataIndex ) {
        var area_min = parseInt( $('#area-min').val(), 10 );
        var area_max = parseInt( $('#area-max').val(), 10 );
        var area = parseFloat( data[3] ) || 0;

        if ( (( isNaN( area_min ) && isNaN( area_max ) ) ||
                ( isNaN( area_min ) && area <= area_max ) ||
                ( area_min <= area   && isNaN( area_max ) ) ||
                ( area_min <= area   && area <= area_max ))  
                )
        {
            return true;
        }
        return false;
    }
);
    var table = $('#tabela-mieszkan').DataTable({
      "paging":   false,
      "ordering": false,
      "info":     false
    });

$( ".slider-range" ).slider({
      range: true,
      min: 10,
      max: 120,
      values: [ 20, 100 ],
      change  : function (event,ui) {
	    $('#area-min').val(ui.values[ 0 ]);
      	$('#area-max').val(ui.values[ 1 ]);
      	$('.filters-slide .pow_min').html(ui.values[ 0 ]+'m2');
	    $('.filters-slide .pow_max').html(ui.values[ 1 ]+'m2');
	  },
	   stop  : function (event,ui) {
	   	table.draw(); return false;
	   },
	  slide  : function (event,ui) {
	    $('#area-min').val(ui.values[ 0 ]);
      	$('#area-max').val(ui.values[ 1 ]);
	    $('.filters-slide .pow_min').html(ui.values[ 0 ]+'m2');
	    $('.filters-slide .pow_max').html(ui.values[ 1 ]+'m2');
	}
});

    $("#tabela-mieszkan th").each( function ( i ) {
		
		if ($(this).text() !== '') {
	        var isStatusColumn = (($(this).text() == '') ? true : false);
	        var counter;
			var select = $('<select><option value="">' + $(this).text() + '</option></select>')
	            .appendTo( $('#select-filters') )
	            .on( 'change', function () {
	                var val = $(this).val();
					
	                table.column( i )
	                    .search( val ? '^'+$(this).val()+'$' : val, true, false )
	                    .draw();
	            } );
	 		
			// Get the Status values a specific way since the status is a anchor/image
			if (isStatusColumn) {
				var statusItems = [];
				
                /* ### IS THERE A BETTER/SIMPLER WAY TO GET A UNIQUE ARRAY OF <TD> data-filter ATTRIBUTES? ### */
				table.column( i ).nodes().to$().each( function(d, j){
					var thisStatus = $(j).attr("data-filter");
					if($.inArray(thisStatus, statusItems) === -1) statusItems.push(thisStatus);
				} );
				
				statusItems.sort();
								
				$.each( statusItems, function(i, item){
				    select.append( '<option value="'+item+'">'+item+'</option>' );
				});

			}
            // All other non-Status columns (like the example)
			else {
				table.column( i ).data().unique().sort().each( function ( d, j ) {  
					select.append( '<option value="'+d+'">'+d+'</option>' );
		        } );	
			}
	        
		}
    } );
