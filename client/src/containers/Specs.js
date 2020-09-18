import React, { Component } from "react";

export default class Specs extends Component {
  render() {
    let features = [];
    if (this.props.features) {
      Object.keys(this.props.features).map((label) => {
        features.push({ label, value: this.props.features[label] });
      });
    } else {
      features = [];
    }

    const style = {
      borderCollapse: "collapse",
      textAlign: "center",
    };
    return (
      <div className="Specs">
        <table style={style} border="1">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Value</th>
            </tr>
          </thead>

          <tbody>
            {features.map((r) => {
              return (
                <tr key={Math.random()}>
                  <td>{r.label}</td>
                  <td>{r.value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
