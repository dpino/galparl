/**
 *
 * Helper class for rendering entries of a word dinamically
 *
 * Diego Pino García <dpino@igalia.com>
 *
 */

function EntryLoader(container) {
    this.container = container; 
}

EntryLoader.URL = "/words/###word###.json";

EntryLoader.prototype.renderWordEntries = function(word) {
    var url = EntryLoader.URL.replace('###word###', word); 
    var entryLoader = this;
    $.get(url, function(data) {
        entryLoader.clear();
        if (data.error) {
            entryLoader.emptyResult(data.error);
            return;
        }
        var left = $("<div class='left'></div>");
        var right = $("<div class='right'></div>");

        var entries = data.entries;
        var half = entries.length / 2;
        for (var i = 0; i < entries.length; i++) {
            var entry = entryLoader.formatEntry(data.word, entries[i]);
            if (i < half) {
                left.append(entry);
            } else {
                right.append(entry);
            }
        }
        entryLoader.append(left);
        entryLoader.append(right);
    });
};

EntryLoader.prototype.clear = function() {
    this.container.html("");
}

EntryLoader.prototype.emptyResult = function(msg) {
    this.container("<p>" + msg + "</p>");
}

EntryLoader.prototype.append = function(child) {
    this.container.append(child);
}

EntryLoader.prototype.formatEntry = function(word, entry) {
    var html = 
        "<div class='comment'>" +
            "<span class='person'>###PERSON###</span>" +
            "<span class='date'>###DATE###</span>" +
            "<div>###BODY###</div>" + 
            "<hr/>" +
        "</div>";
    html = html.replace("###PERSON###", entry.person);  
    html = html.replace("###DATE###", this.formatDate(entry.date));  
    html = html.replace("###BODY###", this.formatBody(word, entry.body));  

    return html;
}

EntryLoader.prototype.formatDate = function(tstamp) {
    var date = new Date(tstamp * 1000);
    var day = date.getUTCDate();
    var month = date.getUTCMonth() + 1;
    var year = date.getUTCFullYear();
    return day + "/" + month + "/" + year;
}

EntryLoader.prototype.formatBody = function(word, body) {
    var excerpt = wrapWord(word, body);
    return excerpt.replace(word, "<span class='highlight'>" + word + "</span>");

    // Return the sentence that contains the word
    function wrapWord (word, body) {
        var pos = body.indexOf(word);
        var start = rindex(body, ".?!", pos);
        var end = index(body, ".?!", pos);
        return body.substring(start, end);
    }

    function rindex(str, chars, pos) {
        if (pos === undefined) pos = str.length;
        for (var i = pos; i > 0; i--) {
            for (var j = 0; j < chars.length; j++) {
                if (str[i] == chars[j]) {
                    return i + 1;
                }
            }
        }
        return -1;
    }

    function index(str, chars, pos) {
        if (pos === undefined) pos = 0
        for (var i = pos; i < str.length; i++) {
            for (var j = 0; j < chars.length; j++) {
                if (str[i] == chars[j]) {
                    return i + 1;
                }
            }
        }
        return -1;
    }
}

