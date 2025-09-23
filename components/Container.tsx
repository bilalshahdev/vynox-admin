import { cn } from "../lib/utils";
import AddButton from "./AddButton";
import { PageSubtitle, PageTitle } from "./Titles";
import { Card, CardContent, CardHeader } from "./ui/card";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  m?: boolean;
  className?: string;
  addBtnTitle?: string;
  isDialog?: boolean;
  dialogContent?: React.ReactNode;
}

const Container = ({
  children,
  title,
  subtitle,
  addBtnTitle,
  isDialog,
  dialogContent,
  m = true,
  className,
  ...rest
}: Props) => {
  return (
    <Card className="flex flex-col h-full overflow-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          {title && <PageTitle title={title} />}
          {subtitle && <PageSubtitle subtitle={subtitle} />}
          {addBtnTitle && (
            <AddButton
              addBtnTitle={addBtnTitle}
              isDialog={isDialog}
              dialogContent={dialogContent}
            />
          )}
        </div>
      </CardHeader>

      <CardContent
        className={cn(`w-full mx-auto flex-1 ${m ? "mb-" : ""}`, className)}
        {...rest}
      >
        {children}
      </CardContent>
    </Card>
  );
};

export default Container;
