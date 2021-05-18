import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import App from '../app';

test('Components render to screen', () => {
  render(<App />);

  const textArea = screen.getByRole('textbox');
  expect(textArea).toHaveTextContent("Enter Text Here");
})