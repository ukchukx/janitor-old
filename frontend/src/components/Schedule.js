import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ScheduleBackups from './ScheduleBackups';

class Schedule extends Component {
  static propTypes = {
    schedule: PropTypes.object.isRequired,
    endpoint: PropTypes.string.isRequired
  };

  state = {
    backups: [],
    busy: false,
    loading: true,
    downloadEndpoint: `${this.props.endpoint}${this.props.schedule.id}/backups/FILE`
  };

  deleteBackup(index) {
    if (! confirm('Are you sure?')) return;

    let { props: { endpoint, schedule: { id } }, state: { backups } } = this;

    fetch(`${endpoint}${id}/backups/${backups[index]}/delete`, {
      method: 'delete',
      headers: new Headers({ 'Content-Type': 'application/json' })
    })
    .then((response) => {
      if (response.status === 204) {
        delete backups[index];

        this.setState({ backups });
      }
    });
  }

  backupNow() {
    if (this.state.busy) return;

    this.setState({ busy: true });

    const { props: { endpoint, schedule } } = this;

    fetch(`${endpoint}${schedule.id}/backups/create`, {
        method: 'post',
        headers: new Headers({ 'Content-Type': 'application/json' })
      })
      .then(response => response.status === 200 ? response.json() : null)
      .then((backups) => {
        if (backups) {
          this.setState({ backups });
        } else {
          alert('Could not create backup');
        }
      })
      .finally(() => this.setState({ busy: false }));
  }

  componentDidMount() {
    const { props: { endpoint, schedule } } = this;

    fetch(`${endpoint}${schedule.id}/backups`)
      .then(response => response.status === 200 ? response.json() : [])
      .then(backups => this.setState({ backups, loading: false }));
  }

  render() {
    const { props: { schedule }, state: { backups, busy, downloadEndpoint, loading } } = this;
    const backupButtonClasses = `button is-fullwidth is-primary is-outlined${busy ? ' is-loading' : ''}`;

    return (
      <div className="column">
        <h2 className="subtitle">
          <strong>{schedule.name}</strong>
        </h2>
        <h4>{schedule.db}://{schedule.host}:{schedule.port}/{schedule.name}</h4>
        <span className="tag is-dark">
          {schedule.schedule === 'weekly' ? `${schedule.day} @ ${schedule.time}` : `Daily @ ${schedule.time}`}
        </span>
        <hr/>
        <button onClick={_ => this.backupNow()} disabled={busy} className={backupButtonClasses}>
          Backup now
        </button>
        {
          loading ?
            <progress className="progress is-small is-info" style={{ marginTop: '10px' }}>Loading...</progress>
           :
            <ScheduleBackups
              backups={backups}
              downloadEndpoint={downloadEndpoint}
              deleteBackup={this.deleteBackup.bind(this)} />
        }
      </div>
    );
  }
}

export default Schedule;
