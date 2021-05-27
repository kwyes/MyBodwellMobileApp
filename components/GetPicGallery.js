export async function getPicGallery(folder, limit) {
    await fetch(`https://api-m.bodwell.edu/api/cantoApi/album/` + folder + `/` + limit)
        .then(response => response.json())
        .then(json => {
            if (json.found > 0) {
                var tmp_img = json["results"]
                var imgs = [];
                for (let i = 0; i < tmp_img.length; i++) {
                    var height = 0;
                    var width = 0;

                    if (parseInt(tmp_img[i].width) >= parseInt(tmp_img[i].heigth)) {
                        width = 1920;
                        height = 1080;
                    } else {
                        width = 1080;
                        height = 1920;
                    }

                    imgs.push({
                        uri: "https://bodwell.canto.com/preview/image/" + tmp_img[i].id + "/840",
                        width: width,
                        height: height,
                        name: tmp_img[i].name
                    })
                }
                return imgs;
            } else {
                Alert.alert(translate('error_text_nodata'));
                return [];
            }
        });
}