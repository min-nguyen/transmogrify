var xmlhttp = new XMLHttpRequest();

function div_width(){
var wd = $("#row-0-col-0").width();
    console.log(wd);
}

function getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}

function initialise(){
    // Create Rows
    var rows = "";
    var num_of_rows = 5;
    for(j = 0; j < num_of_rows; j++){
        var row = createRow(j, j*10);
        rows += row;
    }

    //Bind to document 
    $("#includedContent").html(rows)
    
    refreshFunctions();
    
    //Hide peek box
    $(".OMC_peek_box").hide();

    //Initialise post entries
    for(j = 0; j < num_of_rows; j++){
        for(i = 0; i < 10; i++){
            getPost("row-" + j + "-col-" + i);
        }
    }

   $(window).resize(resizePeekBox);
}

function refreshFunctions(){
    //Insert click element
    $(".col-cell").append(
            "<div class= 'popup'>  </div>"
    );
    
    //Give click element peek box functionality
    $(".popup").click(function(){
        togglePeekBox(this);
    });

    $(".col-cell").click(function(){
       
    });
}

// PEEK BOX
function resizePeekBox() {
    var location = $(".OMC_peek_box").offset();
    var cell_id = $(".OMC_peek_box").attr('data-cell-id');
    var width  = $('#' + cell_id).width();
    var cell_offset = $("#" + cell_id).offset();
    var left_offset = parseInt(cell_offset.left) + parseInt(width);
    var top_offset  = cell_offset.top;
    
    $(".OMC_peek_box").css({ left: left_offset//, top : top_offset
    });
}

// TOGGLE PEEK BOX
function togglePeekBox(popup_dom){
    var offset = $(popup_dom).offset();
    var width  = $(popup_dom).width();
    var cell_id  = $(popup_dom).parent(".col-cell").attr('id'); 
    var offset_and_width = parseInt(offset.left) + parseInt(width);
    if ($(".OMC_peek_box").is(":visible")){
        if($(".OMC_peek_box").offset().left == offset_and_width)
            $(".OMC_peek_box").slideToggle();
        else{
            $(".OMC_peek_box").slideToggle(function(){
                $(".OMC_peek_box").css({left: offset_and_width, top: offset.top});
            });
            
            $(".OMC_peek_box").slideToggle();
            newConnection(popup_dom);
        }
    }
    else{
        console.log("EOAJNEGIAEHGEA0");
        $(".OMC_peek_box").css({left: offset_and_width, top: offset.top});
        $(".OMC_peek_box").load("../views/chat.html");
        $(".OMC_peek_box").slideToggle();
    }
    $(".OMC_peek_box").attr('data-cell-id', cell_id);
}

//Changes iframe src websocket connection
function newConnection(popup_dom){
    
    var connection_id = $(popup_dom).attr('data-connection-id')
    if(connection_id == undefined){
        console.log("Post here is null: No socket connection exists")
        return;
    }

    $('#post_title').text(($(popup_dom).siblings('.cell-text')).text())
    $('#connection').attr('src', './chat/' + connection_id)
}

//Creates 1 row with 10 empty column cells
function createRow(row_num, start_entry){
    return ("<div class = 'row-cell' id = row" + row_num + ">" +
        createColumns(row_num, start_entry) +
        "</div>");
}

//Creates 10 cells in a row and initialises data-entry
function createColumns(row_num, start_entry){

    var cols = "";
    var row_width = 0;
    var colors = new Array('crimson', 'darkred', 'firebrick');

    for(i = 0; i < 10; i++){
        var col_width =  Math.floor(Math.random()*(12-8+1)+8);
        var color   =  colors[Math.floor(Math.random()*(2-0+1)+0)];
        var entry = i + start_entry;
        if((row_width + 12) >= 100){
            col_width = 100 - (row_width);
            cols += ("<div class = 'col-cell' id = row-" + row_num + "-col-" + i + 
                     " style = 'width:" + col_width + "%; background-color:" + color + " '>"
                        + "<div class = 'cell-text' data-entry = '" + entry + "' >  </div>" + "</div>");
            return cols;
        }
        else{
            row_width += col_width;
            cols += ("<div class = 'col-cell' id = row-" + row_num + "-col-" + i + " style = 'width:" + col_width + "%; background-color:" + color + " '>"
                    + "<div class = 'cell-text' data-entry = '" + entry + "' >  </div>"
                    + "</div>");
        }
    }

    return cols;
}

// Appends a row to existing document
function nextRow(){
    var lastcell = getLastCell();
    
    var newrow = createRow(parseInt(lastcell[0]) + 1, parseInt(lastcell[2]) + 1);
    $('#includedContent').append(newrow);

    var new_lastcell = getLastCell();

    num_of_cells = parseInt(new_lastcell[1]) + 1;
    row_num = new_lastcell[0];

    for( i = 0; i < num_of_cells; i++){
        getPost("row-" + row_num + "-col-" + i);
    }
    
    refreshFunctions();
}

//Acquires and inserts post corresponding to attr 'data-entry' in the div class '.cell-text'
function getPost(cell_id){
    console.log("Requesting " + cell_id);
    var cell_text_obj = $("#" + cell_id).children(".cell-text");
    var post_entry = cell_text_obj.attr('data-entry');
    $.ajax({
        url: "//localhost:3000/getPost", 
        data: {entry : post_entry}, 
        type: "POST",
        error: function (XMLHttpRequest, status, error) {
            return false;
        },
        success: function(dataReceived){
            if(dataReceived == undefined){
                return false;
            }
            var response = JSON.parse(dataReceived);
            var post = response.post;
            var entry = response.entry;
            var date = response.date;
            (cell_text_obj.siblings('.popup')).attr('data-connection-id', entry);
            insertPost(cell_id, post);
            return true;
        }
    });
}

function insertPost(cell_id, text){
    var cell = $("#" + cell_id);
    var cell_text = $("#" + cell_id).children(".cell-text");
    $(cell_text).text(text);

    if(cell[0].scrollWidth >= (cell.innerWidth() + 1) || (cell.innerHeight() <=  cell_text.innerHeight())){
        do  {
            var fontSize = parseInt(cell_text.css("font-size"));
            fontSize = fontSize - 1 + "px";
            cell_text.css({'font-size': fontSize});
        } while ( cell[0].scrollWidth >= (cell.innerWidth() + 1) || ((cell).innerHeight() <=  cell_text.innerHeight()));

        var fontSize = parseInt(cell_text.css("font-size"));
        fontSize = (fontSize + 1) + "px";
        cell_text.css({'font-size': fontSize});
    }
    else{
        do  {
            var fontSize = parseInt(cell_text.css("font-size"));
            fontSize = fontSize + 1 + "px";
            cell_text.css({'font-size': fontSize});
        } while ( cell[0].scrollWidth <= (cell.innerWidth() + 1) && ((cell).innerHeight() >  cell_text.innerHeight()));

        var fontSize = parseInt(cell_text.css("font-size"));
        fontSize = (fontSize - 1) + "px";
        cell_text.css({'font-size': fontSize});
    }
}


//Returns row-num, col-num, cell-entry
function getLastCell(){
    var lastrowid = $("#includedContent div.row-cell:last").attr('id');
    var lastcellid = $('#' +  lastrowid + " div.col-cell:last").attr('id');
    var lastcell_entry = $('#' +  lastrowid + " div.col-cell:last").children('.cell-text').attr('data-entry');
    var lastcell_rowcol = extractRowCol(lastcellid);

    return new Array(lastcell_rowcol[0], lastcell_rowcol[1], lastcell_entry);
}

function extractRowCol(cell_id){
    var reg = /row-(.*)-col-(.*)/;
    var arr = cell_id.match(reg);
    return new Array(arr[1], arr[2]);
}



