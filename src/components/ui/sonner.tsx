import { Toaster as Sonner } from "sonner";
import { CircleCheck, CircleAlert, Info, TriangleAlert, X } from 'lucide-react';
import { useDir, useT } from '@/lib/i18n';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const dir = useDir(), t = useT();
  return (
    <Sonner
      className="toaster group"
      dir={dir}
      position={dir === 'rtl' ? 'bottom-left' : 'bottom-right'}
      closeButton
      duration={5000}
      gap={12}
      offset={24}
      mobileOffset={16}
      icons={{ success: <CircleCheck />, error: <CircleAlert />, info: <Info />, warning: <TriangleAlert />, close: <X /> }}
      toastOptions={{
        unstyled: true,
        closeButtonAriaLabel: t('إغلاق الإشعار'),
        classNames: {
          toast: 'floukaa-toast',
          title: 'floukaa-toast-title',
          description: 'floukaa-toast-description',
          closeButton: 'floukaa-toast-close',
          icon: 'floukaa-toast-icon',
          actionButton: 'floukaa-toast-action',
          cancelButton: 'floukaa-toast-cancel',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
