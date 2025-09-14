import { Sheet, SheetContent } from "../ui/sheet";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const MobileNav = (props: Props) => {
  return (
    <Sheet open={props.isOpen} onOpenChange={props.onOpenChange}>
      <SheetContent></SheetContent>
    </Sheet>
  );
};
