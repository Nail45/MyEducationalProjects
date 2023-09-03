ymaps.ready(init);
function init() {
    const mapElem = document.querySelector("#map");
    const myMap = new ymaps.Map(
        "map",
        {
            center: [59.94412952, 30.31589625],
            zoom: 13,
            controls: ["geolocationControl", "zoomControl"]
        },
        {
            suppressMapOpenBlock: true,
            geolocationControlSize: "large",
            geolocationControlPosition: { top: "300px", right: "20px" },
            geolocationControlFloat: "none",
            zoomControlSize: "small",
            zoomControlFloat: "none",
            zoomControlPosition: { top: "200px", right: "20px" }
        }
    );

    if (window.matchMedia("(max-width: 1280px)").matches) {
        if (Object.keys(myMap.controls._controlKeys).length) {
            myMap.controls.remove('zoomControl');
            myMap.controls.remove('geolocationControl');
        }
    }

    myMap.behaviors.disable("scrollZoom");

    const myPlacemark = new ymaps.Placemark(
        [59.93996962, 30.31455729],
        {},
        {
            iconLayout: "default#image",
            iconImageHref: "img/map.svg",
            iconImageSize: [22, 57],
            // iconImageOffset: [-20, -40]
        }
    );

    myMap.geoObjects.add(myPlacemark);
    myMap.container.fitToViewport();
}