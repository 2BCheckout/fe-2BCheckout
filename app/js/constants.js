let url = process.env.EBENEZER_API_URL;
let port = process.env.EBENEZER_API_PORT;

if(!url)
	throw new Error('EBENEZER_API_URL Environment Variable not set');

if(!port)
	throw new Error('EBENEZER_API_PORT Environment Variable not set');

export const apiUrl   = `http://${url}:${port}/api/`;
export const appTitle = 'Ebenezer';

const AppSettings = {
  appTitle,
  apiUrl
};

export default AppSettings;