function font(text) {
    var texte = text.replace(/a/g, "𝑎")
        texte = texte.replace(/b/g, "𝑏")
        texte = texte.replace(/c/g, "𝑐")
        texte = texte.replace(/d/g, "𝑑")
        texte = texte.replace(/e/g, "𝑒")
        texte = texte.replace(/f/g, "𝑓")
        texte = texte.replace(/g/g, "𝑔")
        texte = texte.replace(/h/g, "𝘩")
        texte = texte.replace(/i/g, "𝑖")
        texte = texte.replace(/j/g, "𝑗")
        texte = texte.replace(/k/g, "𝑘")
        texte = texte.replace(/l/g, "𝑙")
        texte = texte.replace(/m/g, "𝑚")
        texte = texte.replace(/n/g, "𝑛")
        texte = texte.replace(/o/g, "𝑜")
        texte = texte.replace(/p/g, "𝑝")
        texte = texte.replace(/q/g, "𝑞")
        texte = texte.replace(/r/g, "𝑟")
        texte = texte.replace(/s/g, "𝑠")
        texte = texte.replace(/t/g, "𝑡")
        texte = texte.replace(/u/g, "𝑢")
        texte = texte.replace(/v/g, "𝑣")
        texte = texte.replace(/w/g, "𝑤")
        texte = texte.replace(/x/g, "𝑥")
        texte = texte.replace(/y/g, "𝑦")
        texte = texte.replace(/z/g, "𝑧")
        texte = texte.replace(/A/g, "𝐴")
        texte = texte.replace(/B/g, "𝐵")
        texte = texte.replace(/C/g, "𝐶")
        texte = texte.replace(/D/g, "𝐷")
        texte = texte.replace(/E/g, "𝐸")
        texte = texte.replace(/F/g, "𝐹")
        texte = texte.replace(/G/g, "𝐺")
        texte = texte.replace(/H/g, "𝐻")
        texte = texte.replace(/I/g, "𝐼")
        texte = texte.replace(/J/g, "𝐽")
        texte = texte.replace(/K/g, "𝐾")
        texte = texte.replace(/L/g, "𝐿")
        texte = texte.replace(/M/g, "𝑀")
        texte = texte.replace(/N/g, "𝑁")
        texte = texte.replace(/O/g, "𝑂")
        texte = texte.replace(/P/g, "𝑃")
        texte = texte.replace(/Q/g, "𝑄")
        texte = texte.replace(/R/g, "𝑅")
        texte = texte.replace(/S/g, "𝑆")
        texte = texte.replace(/T/g, "𝑇")
        texte = texte.replace(/U/g, "𝑈")
        texte = texte.replace(/V/g, "𝑉")
        texte = texte.replace(/W/g, "𝑊")
        texte = texte.replace(/X/g, "𝑋")
        texte = texte.replace(/Y/g, "𝑌")
        texte = texte.replace(/Z/g, "𝑍")
        texte = texte.replace(/é/g, "𝑒́")
        texte = texte.replace(/è/g, "𝙚̀")
        texte = texte.replace(/à/g, "𝑒̀")
        texte = texte.replace(/1/g, "𝟣")
        texte = texte.replace(/2/g, "𝟤")
        texte = texte.replace(/3/g, "𝟥")
        texte = texte.replace(/4/g, "𝟦")
        texte = texte.replace(/5/g, "𝟧")
        texte = texte.replace(/6/g, "𝟨")
        texte = texte.replace(/7/g, "𝟩")
        texte = texte.replace(/8/g, "𝟪")
        texte = texte.replace(/9/g, "𝟫")
        texte = texte.replace(/0/g, "𝟢")
        texte = texte.replace(/ê/g, "𝑒̂")        
        return texte
  }
let imgs = ["https://66.media.tumblr.com/2bd458c9b6b4d58854c49c78854c3b1a/tumblr_n5mzga3Kuj1sg9gi2o1_500.gif",
            "http://68.media.tumblr.com/58e04b9a1e9f5162ef2d1a0ace3c7221/tumblr_ojg1n3EPCG1w0ii2ho1_500.gif",
            "https://images.wave.fr/images//koba-lad-guedro-1.gif",
            "https://thumbs.gfycat.com/AccomplishedWelltodoAstarte-size_restricted.gif",
            "https://thumbs.gfycat.com/UnacceptableDistantCrustacean-max-1mb.gif",
            "https://thumbs.gfycat.com/GenerousImpassionedHornedviper-max-1mb.gif",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZCzJ_MX3do4F9Ri3ZqkXBzGFH6j_fDgCWUSMQ35DrSes0Z6Hy&s",
            "https://66.media.tumblr.com/3603dc4bd81d3111f6093722a9d7c0f0/tumblr_opnkin95Pn1w2tequo1_500.gif"]

let rdm_img = imgs[Math.floor(Math.random() * imgs.length)]

function gentoken(id) {

    function strRandom(o) {
        var a = 10,
            b = 'abcdefghijklmnopqrstuvwxyz',
            c = '',
            d = 0,
            e = ''+b;
        if (o) {
          if (o.startsWithLowerCase) {
            c = b[Math.floor(Math.random() * b.length)];
            d = 1;
          }
          if (o.length) {
            a = o.length;
          }
          if (o.includeUpperCase) {
            e += b.toUpperCase();
          }
          if (o.includeNumbers) {
            e += '1234567890';
          }
        }
        for (; d < a; d++) {
          c += e[Math.floor(Math.random() * e.length)];
        }
        return c;
      }

    let debut = Buffer.from(id).toString("base64")
    let milieu = strRandom({
        includeUpperCase: true,
        includeNumbers: true,
        length: 6
    })
    let fin = strRandom({
        includeUpperCase: true,
        includeNumbers: true,
        length: 27
    })
    let token = (debut + "." + milieu + "." + fin)

    return token;
}
module.exports = {
    font,
    rdm_img,
    gentoken
}