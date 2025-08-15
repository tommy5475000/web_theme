import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';

// ----------------------------------------------------------------------

export function NotFoundView() {
  return (
    <>
      <Logo sx={{ position: 'fixed', top: 20, left: 20 }} />

      <Container
        sx={{
          py: 10,
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h3" sx={{ mb: 2 }}>
          Xin lỗi, không tìm thấy trang này!
        </Typography>
{/* 
        <Typography sx={{ color: 'text.secondary', maxWidth: 480, textAlign: 'center' }}>
          Xin lỗi, Chúng tôi không tìm thấy trang bạn đang vào, vui lòng kiểm tra lại.
        </Typography> */}

        <Box
          component="img"
          src="/assets/illustrations/illustration-404.svg"
          sx={{
            width: 320,
            height: 'auto',
            my: { xs: 5, sm: 10 },
          }}
        />

        <Button component={RouterLink} href="/" size="large" variant="contained" color="inherit">
          Về trang chủ
        </Button>
      </Container>
    </>
  );
}
