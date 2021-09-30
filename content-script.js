console.log("Content Script");

let pagetext = document.getElementsByTagName("body")[0].innerHTML;

const regexp = new RegExp('foo[a-z]*','g');
const str = 'table football, foosball';
const matches = str.matchAll(regexp);

let b = $(":contains('Mrd. Dollar')").filter(function() { return $(this).children().length === 0;});
b.each((i) => {
    console.log(i);
    let t = b.eq(i);
    console.log(t);
    t = t.text();
    console.log(t);

    let start = t.indexOf('Mrd. Dollar');
    let startAmount = t.lastIndexOf(" ", start - 1);

    console.log(t.substr(startAmount, start - startAmount));
});
