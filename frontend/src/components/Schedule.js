import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ScheduleBackups from './ScheduleBackups';

class Schedule extends Component {
  static propTypes = {
    schedule: PropTypes.object.isRequired,
    endpoint: PropTypes.string.isRequired
  };

  state = {
    backups: []
  };

  deleteBackup(index) {
    if (! confirm('Are you sure?')) return;
    //
  }

  componentDidMount() {
    const { props: { endpoint, schedule } } = this;

    fetch(`${endpoint}${schedule.id}/backups`)
      .then(response => response.status === 200 ? response.json() : [])
      .then(backups => this.setState({ backups }));
  }

  render() {
    const { props: { schedule }, state: { backups } } = this;

    return (
      <div className="column">
        <h2 className="subtitle">
          <strong>{schedule.name}</strong>
        </h2>
        <h4>{schedule.db}://{schedule.host}:{schedule.port}/{schedule.name}</h4>
        <span className="tag is-dark">
          Schedule: {schedule.schedule === 'weekly' ? `${schedule.day} @ ${schedule.time}` : `Daily @ ${schedule.time}`}
        </span>
        <hr/>
        <button className="button is-fullwidth is-primary is-outlined">Backup now</button>
        <ScheduleBackups 
          backups={backups}
          deleteBackup={this.deleteBackup.bind(this)} />
      </div>
    );
  }
}

export default Schedule;