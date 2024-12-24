import { cn } from "@/utils/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export function SkeletonCircle({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <Skeleton className={cn("rounded-full", className)} {...props} />;
}

export function SkeletonText({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <Skeleton className={cn("h-4 w-[250px]", className)} {...props} />;
}

export function SkeletonButton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <Skeleton className={cn("h-10 w-[100px]", className)} {...props} />;
}

export function SkeletonImage({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <Skeleton className={cn("h-[200px] w-[200px]", className)} {...props} />;
}

export function SkeletonCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Skeleton className={cn("h-[300px] w-[200px]", className)} {...props}>
      <div className="space-y-3">
        <SkeletonImage className="h-40 w-full" />
        <SkeletonText className="h-4 w-full" />
        <SkeletonText className="h-4 w-2/3" />
        <SkeletonButton className="h-8 w-full" />
      </div>
    </Skeleton>
  );
}

export function SkeletonTable({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      <SkeletonText className="h-8 w-[250px]" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
