const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
    console.log(data);
    let namesArray = data.names;
    let samplesArray = data.samples;
    let metadataArray = data.metadata;

    // add id values to dropdown selection
    for (let i = 0; i < namesArray.length; i++) {
        let dropdown = d3.select("select").append("option").text(namesArray[i]);
    };

    // sort samples array by sample values
    let sortedDescValues = samplesArray.sort((a, b) => b.sample_values - a.sample_values);

    // log to console to check data
    console.log(sortedDescValues[0]);
    console.log(sortedDescValues[0]['id']);
    console.log(`OTU IDs: ${sortedDescValues[0]['otu_ids'].slice(0, 10)}`);
    console.log(`Sample Values: ${sortedDescValues[0]['sample_values'].slice(0, 10)}`);
    console.log(`OTU Labels: ${sortedDescValues[0]['otu_labels'].slice(0, 10)}`);

    // plugging in data to start with on page
    function init() {
        subjectID = sortedDescValues[0]['id'];
        otuIDs = sortedDescValues[0]['otu_ids'];
        values = sortedDescValues[0]['sample_values'];
        otuLabels = sortedDescValues[0]['otu_labels'];

        // initial data for demographic info
        let demoTable = d3.select("#sample-metadata").append("table");

        let metadataKeys = Object.keys(metadataArray[0]);
        let metadataValues = Object.values(metadataArray[0]);

        // console.log(metadataKeys);
        // console.log(metadataValues);

        for (let i = 0; i < metadataKeys.length; i++)
            demoTable.append("tr").attr("class", metadataKeys[i]).text(`${metadataKeys[i]}: ${metadataValues[i]}`);

        //BONUS
        //initial data for gauge
        let gaugeData = [{
            value: metadataValues[6],
            title: {
                text: "Belly Button Washing Frequency <br> Scrubs Per Week",
                // font: {
                //     size: 14
                // }
            },
            type: "indicator",
            mode: "gauge",
            gauge: {
                axis: {
                    range: [null, 9],
                }
            },
        }];

        // let gaugeLayout = {
        //     // colorscale: "greens",
        //     //     width: 600, 
        //     //     height: 500, 
        //     //     margin: { 
        //     //         t: 0, 
        //     //         b: 0 
        //     //     } 
        // };
        Plotly.newPlot('gauge', gaugeData);

        // initial data for bar, using first ID
        let barTrace = [{
            x: values.slice(0, 10).reverse(),
            y: otuIDs.slice(0, 10).map(i => `OTU ${i}`).reverse(),
            text: otuLabels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h'
        }];

        let barLayout = {
            title: `Top 10 OTUs Found for Subject ID ${subjectID}`,
        };

        // initial data for bubble, using first ID
        let bubbleTrace = [{
            x: otuIDs,
            y: values,
            mode: 'markers',
            marker: {
                size: values,
                sizemode: "diameter",
                color: otuIDs
            },
            text: otuLabels,
            type: 'bubble',
        }];

        let bubbleLayout = {
            title: `Samples from Subject ID ${subjectID}`,
            xaxis: {
                title: {
                    text: 'OTU ID'
                }
            }
        }

        Plotly.newPlot("bar", barTrace, barLayout);
        Plotly.newPlot("bubble", bubbleTrace, bubbleLayout);
    };


    d3.selectAll("#selDataset").on("change", optionChanged);


    // This function is called when a dropdown menu item is selected
    function optionChanged() {
        // Use D3 to select the dropdown menu and assign the value of the dropdown menu option to a variable
        let currentID = d3.select("#selDataset").property("value");
        // console.log(dataset)
        console.log(currentID)

        let gaugeTrace = {};

        // loop through samples to find matching data for id selected in dropdown
        for (let i = 0; i < metadataArray.length; i++) {

            if (metadataArray[i]['id'] == currentID) {
                // update metadata tables
                let table = d3.select("table")
                let metadataKeys = Object.keys(metadataArray[i])
                let metadataValues = Object.values(metadataArray[i]);
                for (let i = 0; i < metadataKeys.length; i++)
                    d3.select(`.${metadataKeys[i]}`).text(`${metadataKeys[i]}: ${metadataValues[i]}`);

                // update bonus gauge chart value
                gaugeTrace = {
                    value: metadataValues[6],
                };

            }
        };

        // Initialize arrays
        let barTrace = {};
        let barLayout = {};
        let bubbleTrace = {};
        let bubbleLayout = {};

        // loop through samples to find matching data for id selected in dropdown
        for (let i = 0; i < sortedDescValues.length; i++) {

            if (sortedDescValues[i]['id'] == currentID) {

                currsubjectID = sortedDescValues[i]['id'];
                currOtuIDs = sortedDescValues[i]['otu_ids'];
                currValues = sortedDescValues[i]['sample_values'];
                currOtuLabels = sortedDescValues[i]['otu_labels'];

                let barTrace = {
                    x: [currValues.slice(0, 10).reverse()],
                    y: [currOtuIDs.slice(0, 10).map(i => `OTU ${i}`).reverse()],
                    text: [currOtuLabels.slice(0, 10).reverse()],
                    title: `Top 10 OTUs Found for Subject ID ${currsubjectID}`,


                };

                let barLayout = {
                    title: `Top 10 OTUs Found for Subject ID ${currsubjectID}`,
                }


                let bubbleTrace = {
                    x: [currOtuIDs],
                    y: [currValues],
                    mode: 'markers',
                    marker: {
                        size: currValues,
                        // sizemode: 'area',
                        color: currOtuIDs
                    },
                    text: [currOtuLabels],
                };

                let bubbleLayout = {
                    title: `Samples from Subject ID ${currsubjectID}`
                };

                Plotly.restyle("gauge", gaugeTrace)
                Plotly.restyle("bar", barTrace);
                Plotly.relayout("bar", barLayout);
                Plotly.restyle("bubble", bubbleTrace);
                Plotly.relayout("bubble", bubbleLayout);

            }
        }
    }
    init();
});