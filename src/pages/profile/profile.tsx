import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector } from '../../services/store';
import { useDispatch } from '../../services/store';
import { updateUser, userDataSelector } from '../../services/slices/user';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(userDataSelector);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const updateData: { name?: string; email?: string; password?: string } = {};

    if (formValue.name !== user?.name) {
      updateData.name = formValue.name;
    }
    if (formValue.email !== user?.email) {
      updateData.email = formValue.email;
    }
    if (formValue.password) {
      updateData.password = formValue.password;
    }

    if (Object.keys(updateData).length > 0) {
      dispatch(updateUser(updateData));
      setFormValue((prevState) => ({
        ...prevState,
        password: ''
      }));
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
