import React, { Component } from 'react';
import ScheduleTable from './ScheduleTable';
import ScheduleForm from './ScheduleForm';
import Schedule from './Schedule';

class SchedulePage extends Component {
  state = {
    schedules: [],
    updating: -1,
    viewing: -1,
    endpoint: 'api/schedules/'
  };

  updateSchedule(schedule) {
    let { state: { schedules, updating } } = this;

    schedules = updating === -1 ?
      [...schedules, schedule] :
      schedules.map(s => s.id === schedule.id ? schedule : s);

    updating = -1;

    this.setState({ schedules, updating });
  }

  deleteSchedule(index) {
    if (! confirm('Are you sure?')) return;

    let { state: { endpoint, schedules, updating, viewing } } = this;
    const { id } = schedules[index];

    fetch(`${endpoint}${id}`, {
      method: 'delete',
      headers: new Headers({ 'Content-Type': 'application/json' })
    })
    .then((response) => {
      if (response.status === 204) {
        delete schedules[index];

        if (updating === index) updating = -1;
        if (viewing === index) viewing = -1;

        this.setState({ schedules, updating, viewing });
      }
    });
  }

  selectForUpdate(updating) {
    this.setState({ updating });
  }

  view(viewing) {
    this.setState({ viewing });
  }

  componentDidMount() {
    fetch(this.state.endpoint)
      .then(response => response.status === 200 ? response.json() : [])
      .then(schedules => this.setState({ schedules }));
  }

  render() {
    const { state: { viewing, updating, schedules } } = this;

    return (
      <React.Fragment>
        <nav className="navbar is-transparent">
          <div className="navbar-brand">
            <a className="navbar-item" href="/">
              <h1 className="title">Janitor</h1>
            </a>
            <div className="navbar-burger burger" data-target="navbarMenu">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div id="navbarMenu" className="navbar-menu">
            <div className="navbar-end">
              <div className="navbar-item">
                <a className="button" href="/admin/logout">
                  Log out
                </a>
              </div>
            </div>
          </div>
        </nav>

        <section className="section">
          <div className="container is-fluid">
            <div className="columns">
              <ScheduleForm
                key={`f-${updating}`}
                schedule={updating === -1 ? null : schedules[updating]}
                endpoint={this.state.endpoint}
                updateSchedule={this.updateSchedule.bind(this)} />
              <ScheduleTable
                schedules={this.state.schedules}
                selectForUpdate={this.selectForUpdate.bind(this)}
                deleteSchedule={this.deleteSchedule.bind(this)}
                view={this.view.bind(this)} />
              {viewing === -1 ?
                '' :
                <Schedule
                  key={`s-${viewing}`}
                  endpoint={this.state.endpoint}
                  schedule={schedules[viewing]} />
                }
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default SchedulePage;
