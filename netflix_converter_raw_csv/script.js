document.getElementById('convertButton').addEventListener('click', formatHistory);

function formatHistory() {
    // Get input text
    var inputText = document.getElementById('input').value;

    // Split into lines
    var lines = inputText.split('\n');

    // Initialize output text
    var outputText = 'Title,Date\n';

    // Process each line
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];

        // Split line into fields (assuming tab-separated values)
        var fields = line.split('\t');

        // Get date and title
        var date = fields[0];
        var title = fields[1];

        // Add to output text
        outputText += `"${title}",${date}\n`;
    }

    // Set output text
    document.getElementById('output').value = outputText;
}
