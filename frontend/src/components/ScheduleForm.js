import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

class ScheduleForm extends Component {
  static propTypes = {
    endpoint: PropTypes.string.isRequired,
    updateSchedule: PropTypes.func.isRequired,
    schedule: PropTypes.object
  };

  defaultForm = {
    db: 'mysql',
    name: '',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    keep: 5,
    schedule: 'daily',
    day: 'Monday',
    time: '23:59'
  };

  state = {
    dbs: ['mysql', 'postgresql'],
    schedules: ['daily', 'weekly'],
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    isFormValid: false,
    action: this.props.schedule ? 'Update' : 'Create',
    form: this.props.schedule ? this.props.schedule : { ...this.defaultForm }
  };

  handleChange = (e) => {
    let { form: { port, username } } = this.state;
    
    if (e.target.name === 'db') {
      port = e.target.value === 'mysql' ? 3306 : 5432;
      username = e.target.value === 'mysql' ? 'root' : 'postgres';
    }

    const form = { ...this.state.form, port, username, [e.target.name]: e.target.value };
    
    this.setState({ ...this.state, form, isFormValid: this.validateForm() });
  }

  updateTime = ([date]) => {
    this.setState({ 
      ...this.state, 
      form: { ...this.state.form, time: `${date.getHours()}:${date.getMinutes()}` }, 
      isFormValid: this.validateForm() 
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { state: { form }, props: { endpoint, updateSchedule } } = this;

    fetch(form.id ? `${endpoint}${form.id}` : endpoint, {
      method: form.id ? 'put' : 'post',
      body: JSON.stringify(form),
      headers: new Headers({ 'Content-Type': 'application/json' })
    })
    .then((response) => {
      if (Math.floor(response.status / 100) === 2) {
        this.clearForm();
        return response.json();
      }
    })
    .then(schedule => !!schedule ? updateSchedule(schedule) : null);
  };

  clearForm = () => {
    this.setState({ ...this.state, form: { ...this.defaultForm }, isFormValid: false });
  }

  validateForm = () => {
    const { days, dbs, form, schedules } = this.state;

    return !!form.name &&
      !!form.host &&
      !!form.port &&
      !!form.username &&
      !!form.keep &&
      !!form.time &&
      dbs.includes(form.db) &&
      schedules.includes(form.schedule) &&
      (form.schedule === 'weekly' ? days.includes(form.day) : true);
  }

  render() {
    const { action, days, dbs, form, schedules, isFormValid } = this.state;

    return (
      <div className="column">
        <form onSubmit={this.handleSubmit}>
          <div className="field">
            <label className="label">Database type</label>
            <div className="select">
              <select name="db" onChange={this.handleChange} value={form.db}>
                {dbs.map(x => <option value={x} key={x}>{x}</option>)}
              </select>
            </div>
          </div>
          <div className="columns">
            <div className="column">
              <div className="field">
                <label className="label">Database host</label>
                <div className="control">
                  <input
                    className="input"
                    placeholder="Database host"
                    type="text"
                    name="host"
                    onChange={this.handleChange}
                    value={form.host}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="column">
              <div className="field">
                <label className="label">Database port</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    name="port"
                    onChange={this.handleChange}
                    value={form.port}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="columns">
            <div className="column">
              <div className="field">
                <label className="label">Database username</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="username"
                    onChange={this.handleChange}
                    value={form.username}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="column">
              <div className="field">
                <label className="label">Database password</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="password"
                    onChange={this.handleChange}
                    value={form.password}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="field">
            <label className="label">Database name</label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="name"
                onChange={this.handleChange}
                value={form.name}
                required
              />
            </div>
          </div>
          <div className="columns">
            <div className="column">
              <div className="field">
                <label className="label">Backup schedule</label>
                <div className="select">
                  <select name="schedule" onChange={this.handleChange} value={form.schedule}>
                    {schedules.map(s => <option value={s} key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            {
              form.schedule === 'weekly' ? 
                (
                  <div className="column">
                    <div className="field">
                      <label className="label">Day</label>
                      <div className="select">
                        <select name="day" onChange={this.handleChange} value={form.day}>
                          {days.map(d => <option value={d} key={d}>{d}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                ) : 
                (<p></p>)
            }  
            <div className="column">
              <div className="field">
                <label className="label">Time</label>
                <div className="control">
                  <Flatpickr 
                    data-enable-time
                    required
                    options={{ enableTime: true, noCalendar: true, dateFormat: 'H:i' }}
                    className="input"
                    name="time"
                    value={form.time}
                    onChange={this.updateTime} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="field">
            <label className="label">Preserve last {form.keep} backups</label>
            <div className="control">
              <input
                className="input"
                type="number"
                name="keep"
                onChange={this.handleChange}
                value={form.keep}
                required
              />
            </div>
          </div>
          <div className="control">
            <button disabled={!isFormValid} type="submit" className="button is-info">
              {action} schedule
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default ScheduleForm;