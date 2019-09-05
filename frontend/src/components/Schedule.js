import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Schedule extends Component {
  static propTypes = {
    schedule: PropTypes.object.isRequired
  };

  state = {};

  render() {
    const { schedule } = this.props;

    return (
      <div className="column">
        <h2 className="subtitle">
          <strong>{schedule.name}</strong>
        </h2>
        <h4>{schedule.db}://{schedule.host}:{schedule.port}/{schedule.name}</h4>
        <h6>
          Schedule: {schedule.schedule === 'weekly' ? `${schedule.day} @ ${schedule.time}` : `Daily @ ${schedule.time}`}
        </h6>
        <hr/>
      </div>
    );
  }
}

export default Schedule;