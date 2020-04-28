import axios from 'axios';
import { showAlert } from './alert';

export const updateData = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://localhost:3002/api/v1/users/updatePassword'
        : 'http://localhost:3002/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} Data Update Successfully`);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
