import * as configurationProvider from '@libs/configuration-provider/index';
import fs from 'fs-extra';
import { parse } from 'node-html-parser';
import { HTMLElement } from 'node-html-parser';
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
  emailType: 'alert' | 'activation',
  token: string
) => {
  const templatePath = path.join(__dirname, 'mail.html');
  const html = await loadHtmlTemplate(templatePath);

  // Parse the HTML and make replacements
  const root = parse(html);

  // Update the header
  addPageHeader(root, subject);

  // Update the content
  addPageContent(root, content);

  // Update the button
  addPageButton(root, emailType, token);

  return root.toString();
};

const addPageContent = (root: HTMLElement, content: string) => {
  const contentDiv = root.querySelector('.content p');
  if (contentDiv) {
    contentDiv.set_content(content);
  }
};

const addPageHeader = (root: HTMLElement, subject: string) => {
  const header = root.querySelector('.header h1');
  if (header) {
    header.set_content(subject);
  }
};

const addPageButton = (
  root: HTMLElement,
  emailType: 'alert' | 'activation' | 'passwordReset',
  token: string
) => {
  if (emailType === 'alert') {
    // Remove the button container if not activation email
    const buttonContainer = root.querySelector('.button-container');
    if (buttonContainer) {
      buttonContainer.remove();
    }
  } else if (emailType === 'activation') {
    const button = root.querySelector('#btn');
    const nodeEnv = configurationProvider.getValue('environment.nodeEnv');
    if (button) {
      if (nodeEnv === 'development') {
        button.setAttribute('href', `http://localhost:5173/activateAccount/${token}`);
      } else if (nodeEnv === 'production') {
        button.setAttribute('href', `https://subul.me/activateAccount/${token}`);
      }
    }
  }
};
