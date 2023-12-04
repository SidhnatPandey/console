import React, { useState, ChangeEvent } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import Icon from 'src/@core/components/icon';
import { Paper } from '@mui/material';

interface Data {
    email: string;
    state: string;
    address: string;
    country: string;
    lastName: string;
    currency: string;
    language: string;
    timezone: string;
    firstName: string;
    organization: string;
    number: number | string;
    zipCode: number | string;
}

const initialData: Data = {
    state: '',
    number: '',
    address: '',
    zipCode: '',
    lastName: 'Doe',
    currency: 'usd',
    firstName: 'John',
    language: 'arabic',
    timezone: 'gmt-12',
    country: 'australia',
    organization: 'Pixinvent',
    email: 'john.doe@example.com'
};

const ImgStyled = styled('img')(({ theme }) => ({
    width: 100,
    height: 100,
    marginRight: theme.spacing(6),
    borderRadius: theme.shape.borderRadius
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        textAlign: 'center'
    }
}));

const ResetButtonStyled = styled(Button)(({ theme }) => ({
    marginLeft: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        marginLeft: 0,
        textAlign: 'center',
        marginTop: theme.spacing(2)
    }
}));

const TabAccount = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const [formData, setFormData] = useState<Data>(initialData);
    const [imgSrc, setImgSrc] = useState<string>('/images/avatars/15.png');

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({ defaultValues: { checkbox: false } });

    const handleInputImageChange = (file: ChangeEvent) => {
        const reader = new FileReader();
        const { files } = file.target as HTMLInputElement;

        if (files && files.length !== 0) {
            reader.onload = () => setImgSrc(reader.result as string);
            reader.readAsDataURL(files[0]);

            if (reader.result !== null) {
                setInputValue(reader.result as string);
            }
        }
    };

    const handleInputImageReset = () => {
        setInputValue('');
        setImgSrc('');
    };

    const handleFormChange = (field: keyof Data, value: Data[keyof Data]) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <Box>
            {/* Account Details Card */}
            <Card>
                <CardHeader title="Profile Details" />
                <form>
                    <CardContent sx={{ pt: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ImgStyled src={'/images/avatars/15.png'} alt="Profile Pic" />
                            <div>
                                <ButtonStyled
                                //   component="label"
                                //   variant="contained"
                                //   htmlFor="account-settings-upload-image"
                                >
                                    Upload New Photo
                                    <input
                                        hidden
                                        type="file"
                                        value={inputValue}
                                        accept="image/png, image/jpeg"
                                        onChange={handleInputImageChange}
                                        id="account-settings-upload-image"
                                    />
                                </ButtonStyled>
                                <ResetButtonStyled
                                    color="secondary"
                                    variant="outlined"
                                    onClick={handleInputImageReset}
                                >
                                    Reset
                                </ResetButtonStyled>
                                <Typography sx={{ mt: 4, color: 'text.disabled' }}>
                                    Allowed PNG or JPEG. Max size of 800K.
                                </Typography>
                            </div>
                        </Box>
                    </CardContent>
                    <Divider />
                    <CardContent>
                        <Grid container spacing={5}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={(e) => handleFormChange('firstName', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={(e) => handleFormChange('lastName', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type='email'
                                    label='Email'
                                    value={formData.email}
                                    placeholder='john.doe@example.com'
                                    InputProps={{ readOnly: true }}
                                    onChange={e => handleFormChange('email', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label='Organization'
                                    placeholder='Initialize'
                                    value={formData.organization}
                                    onChange={e => handleFormChange('organization', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type='number'
                                    label='Phone Number'
                                    value={formData.number}
                                    placeholder='202 555 0111'
                                    onChange={e => handleFormChange('number', e.target.value)}
                                    InputProps={{ startAdornment: <InputAdornment position='start'>US (+1)</InputAdornment> }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label='Address'
                                    placeholder='Address'
                                    value={formData.address}
                                    onChange={e => handleFormChange('address', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label='State'
                                    placeholder='California'
                                    value={formData.state}
                                    onChange={e => handleFormChange('state', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type='number'
                                    label='Zip Code'
                                    placeholder='231465'
                                    value={formData.zipCode}
                                    onChange={e => handleFormChange('zipCode', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Country</InputLabel>
                                    <Select
                                        label='Country'
                                        value={formData.country}
                                        onChange={e => handleFormChange('country', e.target.value)}
                                    >
                                        <MenuItem value='australia'>Australia</MenuItem>
                                        <MenuItem value='canada'>Canada</MenuItem>
                                        <MenuItem value='france'>France</MenuItem>
                                        <MenuItem value='united-kingdom'>United Kingdom</MenuItem>
                                        <MenuItem value='united-states'>United States</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Language</InputLabel>
                                    <Select
                                        label='Language'
                                        value={formData.language}
                                        onChange={e => handleFormChange('language', e.target.value)}
                                    >
                                        <MenuItem value='arabic'>Arabic</MenuItem>
                                        <MenuItem value='english'>English</MenuItem>
                                        <MenuItem value='french'>French</MenuItem>
                                        <MenuItem value='german'>German</MenuItem>
                                        <MenuItem value='portuguese'>Portuguese</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Timezone</InputLabel>
                                    <Select
                                        label='Timezone'
                                        value={formData.timezone}
                                        onChange={e => handleFormChange('timezone', e.target.value)}
                                    >
                                        <MenuItem value='gmt-12'>(GMT-12:00) International Date Line West</MenuItem>
                                        <MenuItem value='gmt-11'>(GMT-11:00) Midway Island, Samoa</MenuItem>
                                        <MenuItem value='gmt-10'>(GMT-10:00) Hawaii</MenuItem>
                                        <MenuItem value='gmt-09'>(GMT-09:00) Alaska</MenuItem>
                                        <MenuItem value='gmt-08'>(GMT-08:00) Pacific Time (US & Canada)</MenuItem>
                                        <MenuItem value='gmt-08-baja'>(GMT-08:00) Tijuana, Baja California</MenuItem>
                                        <MenuItem value='gmt-07'>(GMT-07:00) Chihuahua, La Paz, Mazatlan</MenuItem>
                                        <MenuItem value='gmt-07-mt'>(GMT-07:00) Mountain Time (US & Canada)</MenuItem>
                                        <MenuItem value='gmt-06'>(GMT-06:00) Central America</MenuItem>
                                        <MenuItem value='gmt-06-ct'>(GMT-06:00) Central Time (US & Canada)</MenuItem>
                                        <MenuItem value='gmt-06-mc'>(GMT-06:00) Guadalajara, Mexico City, Monterrey</MenuItem>
                                        <MenuItem value='gmt-06-sk'>(GMT-06:00) Saskatchewan</MenuItem>
                                        <MenuItem value='gmt-05'>(GMT-05:00) Bogota, Lima, Quito, Rio Branco</MenuItem>
                                        <MenuItem value='gmt-05-et'>(GMT-05:00) Eastern Time (US & Canada)</MenuItem>
                                        <MenuItem value='gmt-05-ind'>(GMT-05:00) Indiana (East)</MenuItem>
                                        <MenuItem value='gmt-04'>(GMT-04:00) Atlantic Time (Canada)</MenuItem>
                                        <MenuItem value='gmt-04-clp'>(GMT-04:00) Caracas, La Paz</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Currency</InputLabel>
                                    <Select
                                        label='Currency'
                                        value={formData.currency}
                                        onChange={e => handleFormChange('currency', e.target.value)}
                                    >
                                        <MenuItem value='usd'>USD</MenuItem>
                                        <MenuItem value='eur'>EUR</MenuItem>
                                        <MenuItem value='pound'>Pound</MenuItem>
                                        <MenuItem value='bitcoin'>Bitcoin</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(6.5)} !important` }}>
                                <Button variant='contained' sx={{ mr: 4 }}>
                                    Save Changes
                                </Button>
                                <Button type='reset' variant='outlined' color='secondary' onClick={() => setFormData(initialData)}>
                                    cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </form>
            </Card>

            <br />
            {/* Delete Account Card */}
            <Grid item xs={12}>
                <Card>
                    <CardHeader title="Delete Account" />
                    <CardContent>
                        <form onSubmit={handleSubmit(() => { })}>
                            <Paper
                                sx={{
                                    background: 'rgba(255, 165, 0, 0.1)', // Light orange background
                                    p: 2, // Padding
                                    mb: 4, // Margin bottom
                                    borderRadius: 1, // Border radius
                                }}
                            >
                                <Typography variant="body1" color="orange">
                                    Are you sure you want to delete your account?<br />
                                    Once you delete your account, there is no going back. Please be certain.
                                </Typography>
                            </Paper>
                            <Box sx={{ mb: 4 }}>
                                <FormControl>
                                    <Controller
                                        name="checkbox"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <FormControlLabel
                                                label="I confirm my account deactivation"
                                                sx={
                                                    errors.checkbox
                                                        ? { '& .MuiTypography-root': { color: 'error.main' } }
                                                        : null
                                                }
                                                control={
                                                    <Checkbox
                                                        {...field}
                                                        size="small"
                                                        name="validation-basic-checkbox"
                                                        sx={errors.checkbox ? { color: 'error.main' } : null}
                                                    />
                                                }
                                            />
                                        )}
                                    />
                                    {errors.checkbox && (
                                        <FormHelperText
                                            sx={{ color: 'error.main' }}
                                            id="validation-basic-checkbox"
                                        >
                                            Please confirm you want to delete the account
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Box>
                            <Button
                                variant="contained"
                                color="error"
                                type="submit"
                                disabled={errors.checkbox !== undefined}
                            >
                                Deactivate Account
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </Box>
    );
};

export default TabAccount;

