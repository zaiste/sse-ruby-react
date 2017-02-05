/** @jsx React.DOM */
var OutputBox = React.createClass({
  getInitialState: function() {
    return { data: [] };
  },
  loadFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadFromServer();
    setInterval(this.loadFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div>
        <OutputList data={this.state.data}/>
      </div>
    );
  }
});

var Output = React.createClass({
  render: function() {
    return (
      <div className="output">{this.props.children}</div>
    );
  }
})

var OutputList = React.createClass({
  render: function() {
    var outputNodes = this.props.data.map(function(output) {
      return (
        <Output>{output.message}</Output>
      );
    });
    return (
      <div className="outputList">
        {outputNodes}
      </div>
    );
  }
});

React.render(
  <OutputBox url="messages" pollInterval={2000} />, document.getElementById('content'));
