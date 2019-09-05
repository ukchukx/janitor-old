import React, { Component } from 'react';
import ScheduleTable from './ScheduleTable';
import ScheduleForm from './ScheduleForm';

class SchedulePage extends Component {
  state = {
    schedules: [],
    updating: -1,
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

    let { state: { endpoint, schedules, updating } } = this;
    const { id } = schedules[index];

    fetch(`${endpoint}${id}`, {
      method: 'delete',
      headers: new Headers({ 'Content-Type': 'application/json' })
    })
    .then((response) => {
      if (response.status === 204) {
        delete schedules[index];

        if (updating === index) updating = -1;
  
        this.setState({ schedules, updating });
      }      
    });
  }

  selectForUpdate(updating) {
    this.setState({ updating });
  }

  componentDidMount() {
    fetch(this.state.endpoint)
      .then(response => response.status === 200 ? response.json() : [])
      .then(schedules => this.setState({ schedules }));
  }

  render() {
    const { state: { updating, schedules } } = this;

    return (
      <React.Fragment>
        <ScheduleForm 
          key={updating}
          schedule={updating === -1 ? null : schedules[updating]}
          endpoint={this.state.endpoint} 
          updateSchedule={this.updateSchedule.bind(this)} />
        <ScheduleTable 
          schedules={this.state.schedules}
          selectForUpdate={this.selectForUpdate.bind(this)}
          deleteSchedule={this.deleteSchedule.bind(this)} />
      </React.Fragment>
    );
  }
}

export default SchedulePage;