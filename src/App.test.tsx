import React from 'react';
import { shallow } from 'enzyme';
import App from './App';

const testComponent = <App />;
describe('<App/> unit tests', () => {
  const wrapper = shallow(testComponent);
  it('Renders without crashing', () => {
    expect(wrapper).toHaveLength(1);
  });

  it('snapshot match', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
