function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();


function optionChanged(newSample) { 
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample); 
}
function dropdownMenue(dataset) { 
   if (dataset==="barchart"){ 
  d3.select("#bar").transition().duration(900).style("visibility","visible");
  d3.select("#bubble").transition().duration(900).style("visibility","hidden");
  d3.select("#gauge").transition().duration(900).style("visibility","hidden")
  };
  if (dataset==="bubblechart"){
    d3.select("#bar").transition().duration(900).style("visibility","hidden");
    d3.select("#bubble").transition().duration(900).style("visibility","visible");
    d3.select("#gauge").transition().duration(900).style("visibility","hidden");
    };
    if (dataset === "guatechart") {
        d3.select("#bar").transition().duration(900).style("visibility","hidden");
        d3.select("#bubble").transition().duration(900).style("visibility","hidden");
        d3.select("#gauge").transition().duration(900).style("visibility","visible");
    }}  

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(key +":" + value);
    });
    // `${key.toUpperCase()}: ${value}`
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  d3.json("samples.json").then((data) => {
    var samples= data.samples;
    var resultsarray= samples.filter(sampleobject => 
        sampleobject.id == sample);
    var result= resultsarray[0]
  
    var ids = result.otu_ids;
    var labels = result.otu_labels;
    var values = result.sample_values;
    
    var yticks= ids.slice(0, 10).map(otuID => "OTU : " + otuID).reverse();
  //Build a BAR Chart
    var barData =[
      {
        y:yticks,
        x:values.slice(0,10).reverse(),
        text:labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h",
        marker: { color: 'rgb(0, 128, 128)'},
      }
    ];
  
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>",
      width: 400, height: 360,
      
    
    };
  
    Plotly.newPlot("bar", barData, barLayout);

  // Build a BUBBLE Chart
    var bubbleData = [ 
    {
      x: ids,
      y: values,
      text: labels,
      mode: "markers",
      marker: {
        color: ids,
        size: values,
        }
    }
  ];
    var bubbleLayout = {
      title: "<b>Bucteria Cultures Per Sample</b>",
      xaxis: { title: "OTU ID" },
      width: 1350,
      height: 400,
      
      };
  
  
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
    //Build a gauge Chart
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultMetadata = metadata.filter(sampleObj => sampleObj.id == sample);
    var finalMeta = resultMetadata[0];
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: finalMeta.wfreq,
        title: { text: "<b>Belly Button Washing Frequency</b><br>\n Scrubs per week <br>"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
        axis: { range: [0, 10] },
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red" },
          {  range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          {range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "darkgreen" }
        ],
        }
        }
    ]

  // // 5. Create the layout for the gauge chart.
  var gaugeLayout = { width: 500, height: 360, color: { t: 0, b: 0 } };

  // 6. Use Plotly to plot the gauge data and layout.
  Plotly.newPlot("gauge",gaugeData,gaugeLayout);
});
}
