#include <stdio.h>
#include <stdlib.h>

int main(int argc, const char * argv[]) {
  int nbrOfAttendees = atoi(argv[1]);

  printf("Hello to Serverless Meetup Singapore!\n");
  printf("Number of attendees: %d\n", nbrOfAttendees);
  return 0;
}
