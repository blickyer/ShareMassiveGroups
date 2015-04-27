// Mixing jQuery and Node.js code in the same file? Yes please!

$(function(){


    // Display some statistic about this computer, using node's os module.

    var os = require('os');

    $('.stats').append('Number of cpu cores: <span>' + os.cpus().length + '</span>');

    // Node webkit's native UI library. We will need it for later
    var gui = require('nw.gui');

    // Fetch the recent posts on Tutorialzine

    var ul = $('.flipster ul');

    // The same-origin security policy doesn't apply to node-webkit, so we can
    // send ajax request to other sites. Let's fetch Tutorialzine's rss feed:

    $.get('http://feeds.feedburner.com/Tutorialzine', function(response){

        var rss = $(response);

        // Find all articles in the RSS feed:

        rss.find('item').each(function(){
            var item = $(this);

            var content = item.find('encoded').html().split('</a></div>')[0]+'</a></div>';
            var urlRegex = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/g;

            // Fetch the first image of the article
            var imageSource = content.match(urlRegex)[1];


            // Create a li item for every article, and append it to the unordered list

            var li = $('<li><img /><a target="_blank"></a></li>');

            li.find('a')
                .attr('href', item.find('link').text())
                .text(item.find("title").text());

            li.find('img').attr('src', imageSource);

            li.appendTo(ul);

        });

        // Initialize the flipster plugin

        $('.flipster').flipster({
            style: 'carousel'
        });

        // When an article is clicked, open the page in the system default browser.
        // Otherwise it would open it in the node-webkit window which is not what we want.

        $('.flipster').on('click', 'a', function (e) {

            e.preventDefault();

            // Open URL with default browser.
            gui.Shell.openExternal(e.target.href);

        });

    });

});