import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ScheduleTable extends Component {
  static propTypes = {
    schedules: PropTypes.array.isRequired,
    deleteSchedule: PropTypes.func.isRequired,
    selectForUpdate: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className="column">
        <h2 className="subtitle">
          Showing <strong>{this.props.schedules.length}</strong> schedules
        </h2>
        <table className="table is-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Database</th>
              <th>Host</th>
              <th>Schedule</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.props.schedules.map((s, i) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.db}</td>
                <td>{s.host}</td>
                <td>{s.schedule === 'weekly' ? `${s.day} @ ${s.time}` : `Daily @ ${s.time}`}</td>
                <td>
                  <div className="buttons are-small">
                    <button className="button is-outlined">View</button>
                    <button 
                      onClick={(_) => this.props.selectForUpdate(i)} 
                      className="button is-outlined">
                      Update
                    </button>
                    <button 
                      onClick={(_) => this.props.deleteSchedule(i)} 
                      className="button is-outlined is-danger">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ScheduleTable;