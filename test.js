var fs = require('fs');
var xml2js = require('xml2js');

var builder = new xml2js.Builder();
    
var parser = new xml2js.Parser();
fs.readFile(__dirname + '/article.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        // At this point result is just a JS object that is fully 
        // modifiable
        // result.prof_article.title = [{"p": ["Some new Title I PUT."]}]
        // fs.writeFile(__dirname + "/article.json", JSON.stringify(result, undefined, 2), function(err) {
        //     if(err) {
        //         return console.log(err);
        //     }
        //     console.log("The file was saved!");
        // }); 
        result.prof_article.title = [{"p": ["Some new Title I PUT."]}]
        var newXmlFile = builder.buildObject(result);
        fs.writeFile(__dirname + "/article2.xml", newXmlFile, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The new file was created!");
        }); 
    });
});


