var files_request;

$( '#get-files' ).button().click( function() { get_files();  });

function get_files()
{
    files_request = $.getJSON('/mplayer/files', function(data)
    {
        update_files( data );
    })
    .error( function(){ error('Error') });
}

function update_files( files )
{
    //alert(JSON.stringify(files));


    var ul = build_folder_list( files );

    //remove what went before
    $('#files').empty(); //lets hope there was nothing else in there!
    $('#files').append( ul );
    //now make it nice looking
    $(ul).listview( {
//            autodividers: true,
        }
    );

    //now lets put a click event on the files
    $('.playable-file').click( function(event){
        //alert('Going to play ' + $(this).attr('href') );
        play( $(this).attr('href') ); //should this be in here or controls.js?
        //now lets expand the controls thing
        $('#controls').trigger('click');
        return false;
    });
}

function build_folder_list( folder )
{
    var ul = $('<ul/>');
    $.each(folder, function(key, file)
    {
        if( file.hasOwnProperty('hash') ){//then its a file
            var link = $('<a/>', { "href":file.hash, "text": file.name, class: 'playable-file' } );
            ul.append( $('<li/>' ).append(link) );

        }else if( file.hasOwnProperty('files') ){ //its a folder
            var link = $('<a/>', { "href":'#', "text": file.name } );
            var li = $('<li/>' ).append(link);
            li.append( build_folder_list( file.files ) );
            ul.append(li);
        }else if( key=='dirty' ){
            //ignore
        }else{
            error( key + ' in files return does not have a hash nor a files! What is it?');
        }
    });

    return ul;
}