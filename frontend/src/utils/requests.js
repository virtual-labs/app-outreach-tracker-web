import axios from "axios";

const get = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("credential")}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("credential");
      window.location.reload();
    }
    return {
      error: error?.response?.data || error?.message || error,
    };
  }
};

const post = async (url, body) => {
  try {
    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("credential")}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("credential");
      window.location.reload();
    }
    return {
      error: error?.response?.data || error?.message || error,
    };
  }
};

const delete_ = async (url, body) => {
  try {
    const response = await axios.delete(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("credential")}`,
      },
      data: body,
    });
    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("credential");
      window.location.reload();
    }
    return {
      error: error?.response?.data || error?.message || error,
    };
  }
};

export { get, post, delete_ };
