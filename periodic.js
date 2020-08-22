var canvas = d3.select("#periodicwrap").append("svg").attr("class", "pdc").attr("width", 950).attr("height", 650);
var element_groups = canvas.append("g").attr("transform", "translate(0,50)");


var data;
var spacing = 50;
var max_r = 30;
var standard_r = 24;
var transition_time = 1000;
// defined for createTable
var rects = [], labels = [], numbers = [], circles = []
// defined for plotData
var color1 = "red", color2 = "blue"

var info_strings = [
    {
        "title": "Atomic mass",
        "ref": 'Coplen, T.B., et al. "Atomic Weights of the Elements 2013" ciaaw.org (2013)',
        "url": "http://www.ciaaw.org/pubs/TSAW2013_xls.xls"
    }, {
        "title": "Elemental abundance in the Earth's crust",
        "ref": "Wikipedia (averaged values, retrieved: 1/9/2014)",
        "url": "http://en.wikipedia.org/wiki/Abundance_of_elements_in_Earth%27s_crust"
    }, {
        "title": "Electronegativity",
        "ref": "Wikipedia (retrieved: 30/8/2014)",
        "url": "http://en.wikipedia.org/wiki/Electronegativities_of_the_elements_%28data_page%29"
    }, {
        "title": "Electron affinity",
        "ref": "Wikipedia (retrieved: 30/8/2014)",
        "url": "http://en.wikipedia.org/wiki/Electron_affinity_%28data_page%29"
    }, {
        "title": "Calculated atomic radius",
        "ref": 'E. Clementi, et al. (1967). "Atomic Screening Constants from SCF Functions. II. Atoms with 37 to 86 Electrons". J. Chem. Phys. 47: 1300',
        "url": "http://dx.doi.org/10.1063/1.1712084"
    }, {
        "title": "First ionization energy",
        "ref": "David R. Lide (ed.), CRC Handbook of Chemistry and Physics, 84th Edition. CRC Press. Boca Raton, Florida (2003)",
        "url": "https://www.google.com/search?q=David%20R.%20Lide,%20CRC%20Handbook%20of%20Chemistry%20and%20Physics,%2084th%20Edition.%20CRC%20Press"
    }, {
        "title": "Ionic radii (6-fold coordination)",
        "ref": 'R. D. Shannon (1976). "Revised effective ionic radii and systematic studies of interatomic distances in halides and chalcogenides". Acta. Cryst. A32: 751–767',
        "url": "http://dx.doi.org/10.1107/S0567739476001551"

    }

];


var datatype = [
    "Atomic mass = ",
    "Elemental abundance = ",
    "Electronegativity = ",
    "Electron affinity = ",
    "Atomic radius = ",
    "First ionization energy = ",
    "Ionic radius = "
];
var units = [
    "g/mol",
    "ppm",
    "eV",
    "eV",
    "Å",
    "eV",
    "Å"
];


var abund = [], mass = [], electroneg = [], elec_affin = [], atomic_r = [], ionization = [], ionneg3 = [], ionneg2 = [], ionneg1 = [], ion1 = [], ion2 = [], ion3 = [], ion4 = [], ion5 = [], ion6 = [], ion7 = [], ion8 = [];
d3.csv("data.csv", function (csv) {
    data = csv;
    data.forEach(function (d) {
        // force strings to floats
        mass.push(+d.Mass);
        abund.push(+d.abundance);
        electroneg.push(+d.electroneg);
        elec_affin.push(+d.elec_affin);
        atomic_r.push(+d.atomic_r);
        ionization.push(+d.ionization);
        ionneg3.push(+d.ionneg3);
        ionneg2.push(+d.ionneg2);
        ionneg1.push(+d.ionneg1);
        ion1.push(+d.ion1);
        ion2.push(+d.ion2);
        ion3.push(+d.ion3);
        ion4.push(+d.ion4);
        ion5.push(+d.ion5);
        ion6.push(+d.ion6);
        ion7.push(+d.ion7);
        ion8.push(+d.ion8);
    })
    createTable(data)
    makeButtons()
    plotData(mass, "sqrt", 0)
});


var ref = [], sub_title = [], ref_text = [];
var databox = [], db_element = [], db_variable = [], db_symbol = [], db_no = [];
var legend = []
function createTable(data) {
    var blocks = element_groups.selectAll("g").data(data).enter();
    rects = blocks
        .append("rect")
        .attr("width", 48)
        .attr("height", 48)
        .attr("x", function (d) { return parseFloat(d.group) * 50 - 24 })
        .attr("y", function (d) { return parseFloat(d.row) * 50 - 24 })
        .attr("fill", "#DBDBDB");
    labels = blocks
        .append("text")
        .attr("class", "pdc_labels")
        .attr("x", function (d) { return parseFloat(d.group) * 50 + 22 })
        .attr("y", function (d) { return parseFloat(d.row) * 50 + 21 })
        .attr("text-anchor", "end")
        .text(function (d) { return d.Symbol });
    numbers = blocks
        .append("text")
        .attr("class", "pdc_numbers")
        .attr("x", function (d) { return parseFloat(d.group) * 50 - 23 })
        .attr("y", function (d) { return parseFloat(d.row) * 50 - 13 })
        .text(function (d) { return d.No });
    circles = blocks
        .append("circle")
        .attr("cx", function (d) { return parseFloat(d.group) * 50 })
        .attr("cy", function (d) { return parseFloat(d.row) * 50 })
        .attr("r", 0)
        .attr("opacity", 0.5);
    sub_title = canvas.append("text").attr("class", "pdc_sub_title").attr("text-anchor", "middle").attr("x", 475).attr("y", 580);
    ref = canvas.append("svg:a").attr("class", "pdc_ref")
    ref_text = ref.append("text").attr("text-anchor", "middle").attr("x", 475).attr("y", 600);
    databox = canvas.append("g").attr("transform", "translate(240,120)");
    databox.style("opacity", 0);
    databox.append("rect").attr("width", 60).attr("height", 60).attr("fill", "#DBDBDB");
    db_element = databox.append("text").attr("class", "db_element").attr("x", 66).attr("y", 27);
    db_no = databox.append("text").attr("class", "db_no").attr("x", 3).attr("y", 13);
    db_symbol = databox.append("text").attr("text-anchor", "middle").attr("class", "db_symbol").attr("x", 30).attr("y", 42);
    db_variable = databox.append("text").attr("class", "db_variable").attr("x", 66).attr("y", 48);

};

var ib_group = [], ib_numbers = [], ib_arrays = [], massButton = [], abundButton = [], electronegButton = [], elecaffinButton = [], ionizationButton = [];
function makeButtons() {
    ib_group = canvas.append("g").style("opacity", 1).attr("transform", "translate(720,43)");
    ib_numbers = ["-3", "-2", "-1", "0", "+1", "+2", "+3", "+4", "+5", "+6", "+7", "+8"];
    ib_arrays = [ionneg3, ionneg2, ionneg1, atomic_r, ion1, ion2, ion3, ion4, ion5, ion6, ion7, ion8];

    ib_group.selectAll("text").data(ib_numbers).enter()
        .append("text")
        .attr("x", function (d, i) { return i * 18 }).attr("y", 20)
        .attr("text-anchor", "middle")
        .attr("class", function (d, i) { return "ion_buttons pdc_buttons ib" + String(i) })
        .text(function (d) { return d })
        .on("mouseover", function () { d3.select(this).transition().duration(100).attr("fill", "blue") })
        .on("mouseout", function () { d3.select(this).transition().duration(500).attr("fill", "black") })
        .on("click", function (d, i) { if (d == "0") { plotData(ib_arrays[i], 'linear', 4) } else { plotData(ib_arrays[i], 'linear', 6) } });
    ib_group.append("text").attr("x", 81).attr("text-anchor", "middle").attr("class", "ib_title pdc_buttons").text("Radii:")
        .on("mouseover", function () { d3.select(this).transition().duration(100).attr("fill", "blue") })
        .on("mouseout", function () { d3.select(this).transition().duration(500).attr("fill", "black") })
        .on("click", function () { plotData(atomic_r, 'linear', 4) });
    var b_height = 43;
    var b_spacings = [26, 110, 240, 400, 550];
    massButton = canvas.append("text").text("Mass").attr("x", b_spacings[0]).attr("y", b_height).attr("class", "pdc_buttons massButton")
        .on("mouseover", function () { d3.select(this).transition().duration(100).attr("fill", "blue") })
        .on("mouseout", function () { d3.select(this).transition().duration(500).attr("fill", "black") })
        .on("click", function () { plotData(mass, 'sqrt', 0) });
    abundButton = canvas.append("text").text("Abundance").attr("x", b_spacings[1]).attr("y", b_height).attr("class", "pdc_buttons abundButton")
        .on("mouseover", function () { d3.select(this).transition().duration(100).attr("fill", "blue") })
        .on("mouseout", function () { d3.select(this).transition().duration(500).attr("fill", "black") })
        .on("click", function () { plotData(abund, 'log', 1) });
    electronegButton = canvas.append("text").text("Electronegativity").attr("x", b_spacings[2]).attr("y", b_height).attr("class", "pdc_buttons electronegButton")
        .on("mouseover", function () { d3.select(this).transition().duration(100).attr("fill", "blue") })
        .on("mouseout", function () { d3.select(this).transition().duration(500).attr("fill", "black") })
        .on("click", function () { plotData(electroneg, 'sqrt', 2) });
    elecaffinButton = canvas.append("text").text("Electron Affinity").attr("x", b_spacings[3]).attr("y", b_height).attr("class", "pdc_buttons elecaffinButton")
        .on("mouseover", function () { d3.select(this).transition().duration(100).attr("fill", "blue") })
        .on("mouseout", function () { d3.select(this).transition().duration(500).attr("fill", "black") })
        .on("click", function () { plotData(elec_affin, 'sqrt', 3) });
    ionizationButton = canvas.append("text").text("First Ionization Energy").attr("x", b_spacings[4]).attr("y", b_height).attr("class", "pdc_buttons ionizationButton")
        .on("mouseover", function () { d3.select(this).transition().duration(100).attr("fill", "blue") })
        .on("mouseout", function () { d3.select(this).transition().duration(500).attr("fill", "black") })
        .on("click", function () { plotData(ionization, 'sqrt', 5) });
}
function updateLegend() {

};


function plotData(indata, scale_type, ident) {
    // d3.selectAll(".pdc_buttons").attr("fill","black");
    var extent_data = d3.extent(indata);
    if (extent_data[0] != 0) { var min_r = 2 }
    else { var min_r = 0 }
    if (scale_type == "log") {
        var r_scale = d3.scale.log().clamp(true).domain([0.0007, extent_data[1]]).range([0.5, max_r])
        var color_scale = d3.scale.log().clamp(true).domain([0.0007, extent_data[1]]).range([color1, color2])
    }
    else if (scale_type == "sqrt") {
        var r_scale = d3.scale.sqrt().domain(extent_data).range([min_r, max_r])
        var color_scale = d3.scale.sqrt().domain(extent_data).range([color1, color2])
    }
    else {
        var r_scale = d3.scale.linear().domain([0, 2.98]).range([min_r, max_r])
        var color_scale = d3.scale.linear().domain([0, 2.98]).range([color1, color2])
    }
    circles.transition()
        .delay(function (d, i) { return i * 4 })
        .duration(transition_time)
        .attr("r", function (d, i) {
            if (indata[i] == 0) { return 0 }
            else { return r_scale(indata[i]) }
        })
        .attr("fill", function (d, i) { return color_scale(indata[i]) });
    rects.transition()
        .delay(function (d, i) { return i * 4 })
        .duration(transition_time)
        .attr("fill", function (d, i) {
            if (indata[i] == 0) { return "#C6C6C6" }
            else { return "#DBDBDB" }
        });
    circles.on('mouseover', function (d, i) {
        d3.select(this).transition().duration(200).attr("opacity", 0.8);
        databox.transition().duration(100)
            .style("opacity", 0)
            .transition().duration(400)
            .style("opacity", 1);
        db_element.transition().delay(100)
            .text(d.Name);
        db_symbol.transition().delay(100)
            .text(d.Symbol);
        db_no.transition().delay(100)
            .text(d.No);
        db_variable.transition().delay(100)
            .text(datatype[ident] + indata[i] + ' ' + units[ident])
    }).on('mouseout', function () {
        d3.select(this).transition().duration(500).attr("opacity", 0.5);
        databox.transition().delay(10000).duration(1000)
            .style("opacity", 0);
    });
    sub_title.transition().duration(transition_time / 2)
        .style("opacity", 0)
        .transition().duration(transition_time / 2)
        .style("opacity", 1)
        .text(info_strings[ident].title);
    ref_text.transition().duration(transition_time / 2)
        .style("opacity", 0)
        .transition().duration(transition_time / 2)
        .style("opacity", 1)
        .text("reference: " + info_strings[ident].ref);
    ref.attr("xlink:href", info_strings[ident].url);
};
function showIonButtons() {

};
function hideIonButtons() {

};