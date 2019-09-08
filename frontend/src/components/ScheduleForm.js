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
    databases: [],
    fetching: false,
    canFetch: true,
    isFormValid: false,
    action: this.props.schedule ? 'Update' : 'Create',
    form: this.props.schedule ? this.props.schedule : { ...this.defaultForm }
  };

  fetchDatabases = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const { state: { form: { host, port, username, password, db } }, props: { endpoint } } = this;

    this.setState({ fetching: true });

    fetch(`${endpoint}databases`, {
      method: 'post',
      body: JSON.stringify({ host, port, username, password, db }),
      headers: new Headers({ 'Content-Type': 'application/json' })
    })
    .then(response => response.status === 200 ? response.json(): [])
    .then(databases => this.setState({ databases, fetching: false }));
  };

  handleChange = (e) => {
    let { databases, form: { port, username } } = this.state;

    if (e.target.name === 'name' && e.target.value === 'Select a database') return;

    if (e.target.name === 'db') {
      port = e.target.value === 'mysql' ? 3306 : 5432;
      username = e.target.value === 'mysql' ? 'root' : 'postgres';
      databases = [];
    }

    const form = { ...this.state.form, port, username, [e.target.name]: e.target.value };

    this.setState({
      ...this.state,
      databases,
      form,
      isFormValid: this.validateForm(form),
      canFetch: this.isServerInfoAvailable(form)
    });
  }

  updateTime = ([date]) => {
    let minutes = date.getMinutes();
    if (minutes < 9) minutes = `0${minutes}`;

    const form = { ...this.state.form, time: `${date.getHours()}:${minutes}` };

    this.setState({
      ...this.state,
      form,
      isFormValid: this.validateForm(form)
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
    let { databases, form: { db } } = this.state;

    if (db === 'postgresql') databases = [];

    this.setState({
      ...this.state,
      databases,
      form: { ...this.defaultForm },
      isFormValid: false,
      canFetch: false
    });
  }

  validateForm = (form) => {
    const { days, dbs, schedules } = this.state;

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

  isServerInfoAvailable = ({ host, port, username, password, db }) =>
    !!host && port && this.state.dbs.includes(db) && !!username;

  componentDidMount() {
    // If this is an update, we need to fetch databases immediately
    if (this.state.form.id) this.fetchDatabases();
  }

  render() {
    const { action, days, dbs, form, schedules, isFormValid, fetching, databases, canFetch } = this.state;
    const nameSelectClasses = `select${fetching ? ' is-loading' : ''}`;
    const fetchButtonClasses = `button is-info is-outlined${fetching ? ' is-loading' : ''}`;

    return (
      <div className="column is-one-third">
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

          {
            !canFetch ? '' :
              <div className="control" style={{ marginBottom: '10px' }}>
                <button onClick={this.fetchDatabases} disabled={fetching} className={fetchButtonClasses}>
                  Fetch databases
                </button>
              </div>
          }

          <div className="columns">
            <div className="column">
              <div className="field">
                <label className="label">Database</label>
                <div className="control">
                  <div className={nameSelectClasses}>
                    <select name="name" onChange={this.handleChange} value={form.name}>
                      <option>Select a database</option>
                      {databases.map(d => <option value={d} key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Only show other fields if a database has been selected */
            !!form.name ?
            (
              <div>
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
                      ''
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
              </div>
            ) :
            ''
          }
        </form>
      </div>
    );
  }
}

export default ScheduleForm;
