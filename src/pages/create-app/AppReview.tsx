// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import Switch from '@mui/material/Switch'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import Container from '@mui/system/Container'

const ReviewComplete = () => {
  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
        Create App from Source Code
      </Typography>
      <Typography variant='body1' sx={{ color: 'text.secondary', textAlign: 'center' }}>
        Provide data with this form to create your app.
      </Typography>
    <Grid container spacing={6}>
      <Grid item xs={12} lg={6} xl={7}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h5' sx={{ mb: 4 }}>
              Almost done! 🚀
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Confirm your deal details information and submit to create it.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TableContainer>
              <Table>
                <TableBody
                  sx={{
                    '& .MuiTableCell-root': {
                      borderBottom: 0,
                      verticalAlign: 'top',
                      '&:last-of-type': { px: '0 !important' },
                      '&:first-of-type': { pl: '0 !important' },
                      py: theme => `${theme.spacing(0.75)} !important`
                    }
                  }}
                >
                  <TableRow>
                    <TableCell>
                      <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        App Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>api</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        Repository
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>initializ/api</Typography>
                    </TableCell>
                  </TableRow>
                  {/* <TableRow>
                    <TableCell>
                      <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        Branch
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <CustomChip rounded size='small' skin='light' color='warning' label='25PEROFF' />
                    </TableCell>
                  </TableRow> */}
                  <TableRow>
                    <TableCell>
                      <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        Branch
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>main</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        Env Variables
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>2</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        HTTP Port
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>8080</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        HTTP Path
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>/</Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          {/* <Grid item xs={12}>
            <FormControlLabel control={<Switch />} label='I have confirmed the deal details.' />
          </Grid> */}
        </Grid>
      </Grid>
      <Grid
        item
        lg={6}
        xl={5}
        xs={12}
        sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', '& img': { maxWidth: '100%' } }}
      >
        <Box
          sx={{
            pt: 5,
            px: 5,
            width: '100%',
            display: 'flex',
            borderRadius: 1,
            alignItems: 'flex-end',
            justifyContent: 'center',
            border: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <img height={230} alt='App-Review-illustration' src="/images/avatars/App--Review.png" />
        </Box>
      </Grid>
    </Grid>
    </Container>

  )
}

export default ReviewComplete
