// ** React Imports
import { useRef, useState } from 'react'


// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import MuiStep, { StepProps } from '@mui/material/Step'
import MuiStepper, { StepperProps } from '@mui/material/Stepper'
import CardContent, { CardContentProps } from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Step Components

import AppReview from 'src/pages/create-app/AppReview'
import SourceCode from 'src/pages/create-app/SourceCode'
import StepDealUsage from 'src/pages/create-app/AppConfiguration'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Styled Components
import StepperWrapper from 'src/@core/styles/mui/stepper'
import AppConfiguration from 'src/pages/create-app/AppConfiguration'
import React from 'react';

const steps = [
  {
    title: 'Source Code',
    icon: 'tabler:users',
    subtitle: 'Enter Details'
  },
  {
    title: 'Configuration',
    icon: 'tabler:credit-card',
    subtitle: 'Environment Variables'
  },
  {
    icon: 'tabler:checkbox',
    subtitle: 'Review & Submit',
    title: 'Review'
  }
]

const Stepper = styled(MuiStepper)<StepperProps>(({ theme }) => ({
  height: '100%',
  minWidth: '15rem',
  '& .MuiStep-root:not(:last-of-type) .MuiStepLabel-root': {
    paddingBottom: theme.spacing(5)
  },
  [theme.breakpoints.down('md')]: {
    minWidth: 0
  }
}))

const StepperHeaderContainer = styled(CardContent)<CardContentProps>(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    borderRight: 0,
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

const Step = styled(MuiStep)<StepProps>(({ theme }) => ({
  '& .MuiStepLabel-root': {
    paddingTop: 0
  },
  '&:not(:last-of-type) .MuiStepLabel-root': {
    paddingBottom: theme.spacing(6)
  },
  '&:last-of-type .MuiStepLabel-root': {
    paddingBottom: 0
  },
  '& .MuiStepLabel-iconContainer': {
    display: 'none'
  },
  '& .step-subtitle': {
    color: `${theme.palette.text.disabled} !important`
  },
  '& + svg': {
    color: theme.palette.text.disabled
  },
  '&.Mui-completed .step-title': {
    color: theme.palette.text.disabled
  },
  '& .MuiStepLabel-label': {
    cursor: 'pointer'
  }
}))

const CreateDealWizard = () => {
  // ** States
  const [activeStep, setActiveStep] = useState<number>(0)

  const sourceCodeRef = useRef<any>();

  // Handle Stepper
  const [sourceCodeData, setSourceCodeData] = useState<any>({});
  const [configurationData, setConfigurationData] = useState<any>({});


  // Handle Stepper
  const handleNext = (data: any) => {
    // Update data based on the active step
    if (activeStep === 0) {
      setSourceCodeData(data);
    } else if (activeStep === 1) {
      setConfigurationData(data);
    }

    // Move to the next step
    setActiveStep(activeStep + 1);
    console.log("Data received in index:", data);

  };

  const handlePrev = () => {
    if (activeStep !== 0) {
      setActiveStep(activeStep - 1)
    }
  }

  const getSourceCodeData = () => {

  }



  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <SourceCode onSubmit={getSourceCodeData} />
      case 1:
        return <AppConfiguration onNext={handleNext} />;
      case 2:
        return <AppReview />

      default:
        return null
    }
  }

  const renderContent = () => {
    return getStepContent(activeStep)
  }

  const renderFooter = () => {
    const stepCondition = activeStep === steps.length - 1

    return (
      <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          color='secondary'
          variant='outlined'
          onClick={handlePrev}
          disabled={activeStep === 0}
          startIcon={<Icon icon='tabler:chevron-left' />}
        >
          Previous
        </Button>
        <Button
          variant='contained'
          type='submit'
          color={stepCondition ? 'success' : 'primary'}
          {...(!stepCondition ? { endIcon: <Icon icon='tabler:chevron-right' /> } : {})}
          onClick={() => (stepCondition ? alert('Submitted..!!') : handleNext({}))}
        >
          {stepCondition ? 'Submit' : 'Next'}
        </Button>
      </Box>
    )

  }

  return (
    <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      <StepperHeaderContainer>
        <StepperWrapper sx={{ height: '100%' }}>
          <Stepper
            connector={<></>}
            orientation='vertical'
            activeStep={activeStep}
            sx={{ height: '100%', minWidth: '15rem' }}
          >
            {steps.map((step, index) => {
              const RenderAvatar = activeStep >= index ? CustomAvatar : Avatar

              return (
                <Step
                  key={index}
                  onClick={() => setActiveStep(index)}
                  sx={{ '&.Mui-completed + svg': { color: 'primary.main' } }}
                >
                  <StepLabel>
                    <div className='step-label'>
                      <RenderAvatar
                        variant='rounded'
                        {...(activeStep >= index && { skin: 'light' })}
                        {...(activeStep === index && { skin: 'filled' })}
                        {...(activeStep >= index && { color: 'primary' })}
                        sx={{
                          ...(activeStep === index && { boxShadow: theme => theme.shadows[3] }),
                          ...(activeStep > index && { color: theme => hexToRGBA(theme.palette.primary.main, 0.4) })
                        }}
                      >
                        <Icon icon={step.icon} />
                      </RenderAvatar>
                      <div>
                        <Typography className='step-title'>{step.title}</Typography>
                        <Typography className='step-subtitle'>{step.subtitle}</Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
      </StepperHeaderContainer>
      <CardContent sx={{ pt: theme => `${theme.spacing(6)} !important` }}>
        {renderContent()}
        {renderFooter()}
      </CardContent>

    </Card>
  )
}

export default CreateDealWizard
