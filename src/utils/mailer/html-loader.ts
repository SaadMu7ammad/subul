import * as configurationProvider from '@libs/configuration-provider/index';
import fs from 'fs-extra';
import { parse } from 'node-html-parser';
import path from 'path';

export const loadHtmlTemplate = async (templatePath: string): Promise<string> => {
  try {
    return await fs.readFile(templatePath, 'utf-8');
  } catch (error) {
    throw new Error(`Error loading HTML template: ${error}`);
  }
};

export const createHtmlPage = async (
  subject: string,
  content: string,
  isActivationEmail: boolean,
  token: string
) => {
  const templatePath = path.join(__dirname, 'mail.html');
  const html = await loadHtmlTemplate(templatePath);

  // Parse the HTML and make replacements
  const root = parse(html);

  // Update the header
  const header = root.querySelector('.header h1');
  if (header) {
    header.set_content(subject);
  }

  // Update the content
  const contentDiv = root.querySelector('.content p');
  if (contentDiv) {
    contentDiv.set_content(content);
  }

  // If it's an activation email, update the button link
  if (isActivationEmail) {
    const button = root.querySelector('#btn');
    const nodeEnv = configurationProvider.getValue('environment.nodeEnv');
    if (button) {
      if (nodeEnv === 'development') {
        button.setAttribute('href', `http://localhost:5173/activateAccount/${token}`);
      } else if (nodeEnv === 'production') {
        button.setAttribute('href', `https://charity-proj.netlify.app/activateAccount/${token}`);
      }
    }
  } else {
    // Remove the button container if not activation email
    const buttonContainer = root.querySelector('.button-container');
    if (buttonContainer) {
      buttonContainer.remove();
    }
  }
  return root.toString();
};
