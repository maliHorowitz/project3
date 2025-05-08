

class Fetch {
  constructor() {
    this.baseURL = 'http://localhost:3000/api/';
  }
  async get(myUrl, options = {}) {
    try {
      console.log(myUrl);
      let url = this.baseURL + myUrl;
      return fetch(url, options)
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            console.log("res.status", res);
            throw new Error('Request failed with status ' + res.status);
          }
        })
        .then((data) => {
          return data
        });
    }
    catch (error) {
      console.log("error", error);
      throw error
    }
  }
  async post(myUrl, data) {
    try {
      let url = this.baseURL + myUrl;
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then((res) => {
          if (res.status === 201) {
            return res.json();
          } else {
            throw new Error('Request failed with status ' + res.status);
          }
        })
        .then((date) => {
          return date;
        });
    } catch (error) {
      throw error;
    }
  }

  async put(myUrl, data) {
    try {
      let url = this.baseURL + myUrl;
      return fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            throw new Error('Request failed with status ' + res.status);
          }
        })
        .then((date) => {
          return date;
        });
    } catch (error) {
      throw error;
    }
  }

  async delete(myUrl) {
    try {
      let url = this.baseURL + myUrl;
      return fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => {
          if (res.status === 200 || res.status === 204) {
            return 'Resource deleted successfully';
          } else {
            throw new Error('Request failed with status ' + res.status);
          }
        });
    } catch (error) {
      throw error;
    }
  }

}
export default Fetch