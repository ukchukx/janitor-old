import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ScheduleBackups extends Component {
  static propTypes = {
    backups: PropTypes.array.isRequired,
    downloadEndpoint: PropTypes.string.isRequired,
    deleteBackup: PropTypes.func.isRequired
  };

  downloadHref(file) {
    return this.props.downloadEndpoint.replace('FILE', file);
  }

  render() {
    const styles = { marginTop: '30px' };

    return (
      <div className="backups" style={styles}>
        {!this.props.backups.length ?
          <p>No backups available</p> :
          (
            <table className="table is-striped">
              <thead>
                <tr>
                  <th>File</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
              {this.props.backups.map((b, i) => (
                  <tr key={i}>
                    <td>{b}</td>
                    <td>
                      <div className="buttons are-small">
                        <a target="_blank" href={this.downloadHref(b)} className="button is-outlined">
                          Download
                        </a>
                        <button
                          onClick={(_) => this.props.deleteBackup(i)}
                          className="button is-outlined is-danger">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </div>
    );
  }
}

export default ScheduleBackups;